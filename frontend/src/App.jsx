import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const STATUS_COLORS = {
  todo: '#ff4d4f',
  'on progress': '#fa8c16',
  done: '#52c41a',
  archived: '#8c8c8c',
};

const STATUS_ORDER = ['todo', 'on progress', 'done', 'archived'];

function Modal({ title, children, onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 8,
          width: '90%',
          maxWidth: 400,
          position: 'relative',
        }}
      >
        <h2>{title}</h2>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'none',
            border: 'none',
            fontSize: 20,
            cursor: 'pointer',
          }}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

function AddActivityForm({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim()) {
      await onAdd(name.trim());
      onClose();
    }
  };
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input
        placeholder="Nama Activity"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="input-style"
      />
      <button type="submit" className="button-style">
        Tambah
      </button>
    </form>
  );
}

function AddPicForm({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim()) {
      await onAdd(name.trim());
      onClose();
    }
  };
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input
        placeholder="Nama PIC"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="input-style"
      />
      <button type="submit" className="button-style">
        Tambah
      </button>
    </form>
  );
}

function AddTaskForm({ activities, pics, onAdd, onClose }) {
  const [content, setContent] = useState('');
  const [picId, setPicId] = useState('');
  const [detail, setDetail] = useState('');
  const [filterPic, setFilterPic] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) return alert('Content harus dipilih');
    await onAdd(content, picId || null, detail.trim());
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <select
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="select-style"
      >
        <option value="">Pilih Activity</option>
        {activities.map((activity) => (
          <option key={activity.id} value={activity.name}>
            {activity.name}
          </option>
        ))}
      </select>
      <select
        value={picId}
        onChange={(e) => setPicId(e.target.value)}
        className="select-style"
      >
        <option value="">Pilih PIC (optional)</option>
        {pics.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <textarea
        placeholder="Detail Task"
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        className="textarea-style"
      />
      <button type="submit" className="button-style">
        Tambah
      </button>
    </form>
  );
}

function TaskCard({ task, picName, onPauseToggle, onMoveLeft, onMoveRight }) {
  // isPaused true jika pause_time ada (tidak null dan bukan "-")
  const isPausedInitial = task.pause_time && task.pause_time !== '-';
  const [isPaused, setIsPaused] = useState(isPausedInitial);
  const [currentPauseMinutes, setCurrentPauseMinutes] = useState(0);
  const pauseStartRef = useRef(null);
  const intervalRef = useRef(null);

  // Jika isPaused true, mulai hitung durasi pause berjalan dari pause_time
  useEffect(() => {
    if (isPaused) {
      pauseStartRef.current =
        pauseStartRef.current || new Date(task.pause_time).getTime();
      intervalRef.current = setInterval(() => {
        const diffMs = Date.now() - pauseStartRef.current;
        setCurrentPauseMinutes(Math.floor(diffMs / 60000));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      pauseStartRef.current = null;
      setCurrentPauseMinutes(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPaused, task.pause_time]);

  const togglePause = () => {
    if (isPaused) {
      // Play: hitung durasi pause berjalan, tambahkan ke minute_pause, reset pause_time di DB
      const pauseEnd = Date.now();
      const pauseDuration = Math.floor(
        (pauseEnd - pauseStartRef.current) / 60000
      );
      onPauseToggle(task.id, pauseDuration, true);
      setIsPaused(false);
    } else {
      // Pause: set pause_time ke sekarang di DB
      const nowISO = new Date().toISOString();
      onPauseToggle(task.id, 0, false, nowISO);
      setIsPaused(true);
    }
  };

  // Total pause yang ditampilkan = minute_pause + durasi pause berjalan (jika pause aktif)
  const totalPause =
    (task.minute_pause || 0) + (isPaused ? currentPauseMinutes : 0);

  return (
    <div
      className="task-card"
      style={{ backgroundColor: STATUS_COLORS[task.status], marginBottom: 10 }}
    >
      <div>
        <b>Content:</b> {task.content}
      </div>
      <div>
        <b>Detail:</b> {task.detail}
      </div>
      <div style={{ marginTop: 8 }}>
        <button
          onClick={() => onMoveLeft(task)}
          disabled={task.status === 'todo'}
        >
          ←
        </button>
        <button
          onClick={() => onMoveRight(task)}
          disabled={task.status === 'archived'}
          style={{ marginLeft: 8 }}
        >
          →
        </button>
        {task.status === 'on progress' && (
          <button onClick={togglePause} style={{ marginLeft: 12 }}>
            {isPaused ? 'Play' : 'Pause'}
          </button>
        )}
        <span style={{ marginLeft: 10, fontSize: 18 }}>
          <b>{picName || '-'}</b>
        </span>
      </div>
      <div
        style={{
          fontSize: 12,
          display: 'grid',
          gap: '6px 20px',
          marginTop: 10,
        }}
      >
        <small>
          <div>
            To Do:{' '}
            {task.timestamp_todo
              ? new Date(task.timestamp_todo).toLocaleString()
              : '-'}
            , Progress:{' '}
            {task.timestamp_progress
              ? new Date(task.timestamp_progress).toLocaleString()
              : '-'}
          </div>
          <div>
            Done:{' '}
            {task.timestamp_done
              ? new Date(task.timestamp_done).toLocaleString()
              : '-'}
            , Archived:{' '}
            {task.timestamp_archived
              ? new Date(task.timestamp_archived).toLocaleString()
              : '-'}
          </div>
          <div>
            Pause Started At:{' '}
            {task.pause_time ? new Date(task.pause_time).toLocaleString() : '-'}
            , Pause Minutes: {totalPause}
          </div>
        </small>
      </div>
      {task.status === 'done' && (
        <div style={{ marginTop: 10 }}>
          <b>Activity Minutes:</b> {task.minute_activity || 0}
        </div>
      )}
      {task.status === 'archived' && (
        <div style={{ marginTop: 10 }}>
          <b>Activity Minutes:</b> {task.minute_activity || 0}
        </div>
      )}
    </div>
  );
}

function KanbanColumn({
  status,
  tasks,
  pics,
  onMoveLeft,
  onMoveRight,
  onPauseToggle,
}) {
  return (
    <div
      style={{
        flex: 1,
        margin: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
        minHeight: 400,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h3 style={{ color: STATUS_COLORS[status] }}>{status.toUpperCase()}</h3>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          picName={pics.find((p) => p.id === task.pic_id)?.name}
          onMoveLeft={onMoveLeft}
          onMoveRight={onMoveRight}
          onPauseToggle={onPauseToggle}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [activities, setActivities] = useState([]);
  const [pics, setPics] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    fetchActivities();
    fetchPics();
    fetchTasks();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/activities');
      const data = await res.json();
      setActivities(data);
    } catch (err) {
      console.error('Failed to fetch activities', err);
    }
  };

  const fetchPics = async () => {
    try {
      const res = await fetch('/api/pics');
      const data = await res.json();
      setPics(data);
    } catch (err) {
      console.error('Failed to fetch pics', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  const addActivity = async (name) => {
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Failed to add activity');
      const newActivity = await res.json();
      setActivities((prev) => [newActivity, ...prev]);
    } catch (err) {
      alert(err.message);
    }
  };

  const addPic = async (name) => {
    try {
      const res = await fetch('/api/pics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Failed to add PIC');
      const newPic = await res.json();
      setPics((prev) => [newPic, ...prev]);
    } catch (err) {
      alert(err.message);
    }
  };

  const addTask = async (content, pic_id, detail) => {
    try {
      const now = new Date().toISOString();
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          pic_id,
          detail,
          status: 'todo',
          timestamp_todo: now,
          timestamp_progress: null,
          timestamp_done: null,
          timestamp_archived: null,
          minute_pause: 0,
          minute_activity: 0,
          pause_time: null,
        }),
      });
      if (!res.ok) throw new Error('Failed to add task');
      await fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const now = new Date().toISOString();
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      let timestamp_todo = task.timestamp_todo;
      let timestamp_progress = task.timestamp_progress;
      let timestamp_done = task.timestamp_done;
      let timestamp_archived = task.timestamp_archived;
      let minute_activity = task.minute_activity || 0;

      if (newStatus === 'todo') timestamp_todo = now;
      else if (newStatus === 'on progress') timestamp_progress = now;
      else if (newStatus === 'done') {
        timestamp_done = now;
        if (task.timestamp_progress) {
          const diff = new Date(now) - new Date(task.timestamp_progress);
          minute_activity = Math.floor(diff / 60000);
        }
      } else if (newStatus === 'archived') timestamp_archived = now;

      const res = await fetch(`/api/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          timestamp_todo,
          timestamp_progress,
          timestamp_done,
          timestamp_archived,
          minute_pause: task.minute_pause || 0,
          minute_activity,
          pause_time: task.pause_time || null,
        }),
      });
      if (!res.ok) throw new Error('Failed to update task status');

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: newStatus,
                timestamp_todo,
                timestamp_progress,
                timestamp_done,
                timestamp_archived,
                minute_activity,
              }
            : t
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  /**
   * onPauseToggle:
   * @param {number} taskId - id task
   * @param {number} pauseMinutes - durasi pause yang sudah berjalan (menit)
   * @param {boolean} resetPauseTime - jika true, berarti tombol Play ditekan, pause_time direset ke null dan durasi pause ditambahkan ke minute_pause
   * @param {string|null} newPauseTime - jika pause dimulai, kirim timestamp ISO string, jika tidak, null
   */
  const onPauseToggle = async (
    taskId,
    pauseMinutes,
    resetPauseTime = false,
    newPauseTime = null
  ) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      let updatedMinutePause = task.minute_pause || 0;
      let updatedPauseTime = task.pause_time;

      if (resetPauseTime) {
        // Tombol Play ditekan: tambahkan durasi pause berjalan ke minute_pause, reset pause_time ke null
        updatedMinutePause += pauseMinutes;
        updatedPauseTime = null;
      } else if (newPauseTime) {
        // Tombol Pause ditekan: set pause_time ke waktu sekarang
        updatedPauseTime = newPauseTime;
      }

      const res = await fetch(`/api/tasks/${taskId}/pause`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minute_pause: updatedMinutePause,
          pause_time: updatedPauseTime,
        }),
      });
      if (!res.ok) throw new Error('Failed to update pause data');

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                minute_pause: updatedMinutePause,
                pause_time: updatedPauseTime,
              }
            : t
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const onMoveLeft = (task) => {
    const currentIndex = STATUS_ORDER.indexOf(task.status);
    if (currentIndex > 0) {
      const newStatus = STATUS_ORDER[currentIndex - 1];
      updateTaskStatus(task.id, newStatus);
    }
  };

  const onMoveRight = (task) => {
    const currentIndex = STATUS_ORDER.indexOf(task.status);
    if (currentIndex < STATUS_ORDER.length - 1) {
      const newStatus = STATUS_ORDER[currentIndex + 1];
      updateTaskStatus(task.id, newStatus);
    }
  };

  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === 'todo'),
    'on progress': tasks.filter((t) => t.status === 'on progress'),
    done: tasks.filter((t) => t.status === 'done'),
    archived: tasks.filter((t) => t.status === 'archived'),
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header
        style={{
          backgroundColor: '#001529',
          color: 'white',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1 style={{ margin: 0 }}>Kanban App</h1>
        <nav>
          <button
            onClick={() => setModalType('activity')}
            className="button-style"
          >
            Tambah Activity
          </button>
          <button onClick={() => setModalType('pic')} className="button-style">
            Tambah PIC
          </button>
          <button onClick={() => setModalType('task')} className="button-style">
            Tambah Task
          </button>
        </nav>
      </header>

      <main
        style={{
          flex: 1,
          display: 'flex',
          padding: 20,
          gap: 10,
          backgroundColor: '#fafafa',
        }}
      >
        {STATUS_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
            pics={pics}
            onMoveLeft={onMoveLeft}
            onMoveRight={onMoveRight}
            onPauseToggle={onPauseToggle}
          />
        ))}
      </main>

      <footer
        style={{
          textAlign: 'center',
          padding: 10,
          backgroundColor: '#001529',
          color: 'white',
        }}
      >
        &copy; 2025 Kanban App
      </footer>

      {modalType === 'activity' && (
        <Modal title="Tambah Activity" onClose={() => setModalType(null)}>
          <AddActivityForm
            onAdd={addActivity}
            onClose={() => setModalType(null)}
          />
        </Modal>
      )}
      {modalType === 'pic' && (
        <Modal title="Tambah PIC" onClose={() => setModalType(null)}>
          <AddPicForm onAdd={addPic} onClose={() => setModalType(null)} />
        </Modal>
      )}
      {modalType === 'task' && (
        <Modal title="Tambah Task" onClose={() => setModalType(null)}>
          <AddTaskForm
            activities={activities}
            pics={pics}
            onAdd={addTask}
            onClose={() => setModalType(null)}
          />
        </Modal>
      )}
    </div>
  );
}
