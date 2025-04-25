// Home.jsx
import React, { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaTasks } from 'react-icons/fa'
import { Popconfirm, message } from 'antd'
import AddTaskModal from '../components/AddTaskModal'
import EditModal from '../components/EditModal'
import { auth, database } from '../database/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { ref, onValue, off, push, set, update, remove } from 'firebase/database'

const Home = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', dueDate: '' })
  const [showEditModal, setShowEditModal] = useState(false)
  const [editTask, setEditTask] = useState(null)

  useEffect(() => {
    let tasksRef, tasksListener
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setTasks([])
        setLoading(false)
        return
      }
      tasksRef = ref(database, `users/${user.uid}/tasks`)
      tasksListener = onValue(tasksRef, (snapshot) => {
        const data = snapshot.val()
        const parsed = data
          ? Object.entries(data).map(([id, v]) => ({ id, ...v })).reverse()
          : []
        setTasks(parsed)
        setLoading(false)
      })
    })
    return () => {
      unsubscribeAuth()
      if (tasksRef && tasksListener) off(tasksRef)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewTask(prev => ({ ...prev, [name]: value }))
  }

  const resetTaskForm = () => {
    setNewTask({ title: '', description: '', priority: 'Medium', dueDate: '' })
  }

  const handleProgressChange = async (taskId, newProgress) => {
    const user = auth.currentUser
    if (!user) return
    const progressValue = parseInt(newProgress, 10)
    let updatedStatus = 'To Do'
    if (progressValue === 100) updatedStatus = 'Completed'
    else if (progressValue > 0) updatedStatus = 'In Progress'
    const taskRef = ref(database, `users/${user.uid}/tasks/${taskId}`)
    await update(taskRef, { progress: progressValue, status: updatedStatus })
  }

  const handleDelete = async (taskId) => {
    const user = auth.currentUser
    if (!user) return
    const taskRef = ref(database, `users/${user.uid}/tasks/${taskId}`)
    await remove(taskRef)
    message.success('Task deleted successfully')
  }

  const handleEditClick = (task) => {
    setEditTask(task)
    setShowEditModal(true)
  }

  const handleUpdateTask = async (updated) => {
    const user = auth.currentUser
    if (!user) return
    const taskRef = ref(database, `users/${user.uid}/tasks/${updated.id}`)
    await update(taskRef, {
      title: updated.title,
      description: updated.description,
      priority: updated.priority,
      dueDate: updated.dueDate
    })
    message.success('Task updated successfully')
    setShowEditModal(false)
  }

  const addTaskToDb = async () => {
    const user = auth.currentUser
    if (!user) return
    const tasksRef = ref(database, `users/${user.uid}/tasks`)
    const newRef = push(tasksRef)
    await set(newRef, { ...newTask, status: 'To Do', progress: 0 })
    resetTaskForm()
    setShowModal(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  )

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus className="mr-2" /> New Task
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <div
              key={task.id}
              className={`card shadow-xl ${
                task.status === 'Completed'
                  ? 'bg-green-200 opacity-70'
                  : 'bg-base-100'
              }`}
            >
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h2 className="card-title">{task.title}</h2>
                  <span className={`badge ${
                    task.priority === 'High' ? 'badge-error' :
                    task.priority === 'Medium' ? 'badge-warning' : 'badge-success'
                  } text-sm capitalize`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-2">{task.description}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <span className="badge badge-outline text-sm capitalize">{task.status}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Due Date:</span>
                    <span className="text-gray-500 text-sm">{task.dueDate}</span>
                  </div>
                </div>
                {/* Progress with accessible label */}
                <div className="mt-4">
                  <div className="mb-2">
                    <label htmlFor={`progress-${task.id}`} className="flex justify-between text-sm">
                      <span>Progress:</span>
                      <span className="text-sm">{task.progress}%</span>
                    </label>
                  </div>
                  <input
                    type="range"
                    id={`progress-${task.id}`}
                    min="0"
                    max="100"
                    value={task.progress}
                    onChange={e => handleProgressChange(task.id, e.target.value)}
                    className="range range-primary w-full"
                  />
                </div>
                <div className="card-actions justify-end mt-4 space-x-2">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleEditClick(task)}
                  >
                    <FaEdit className="mr-2" /> Edit
                  </button>
                  <Popconfirm
                    title="Are you sure you want to delete this task?"
                    onConfirm={() => handleDelete(task.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <button
                      className="btn btn-error btn-ghost btn-sm"
                    >
                      <FaTrash className="mr-2" /> Delete
                    </button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))}
        </div>
        {tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4"><FaTasks /></div>
            <h3 className="text-xl font-semibold">No tasks found</h3>
            <p className="text-gray-500 mt-2">Create your first task to get started</p>
          </div>
        )}
        <AddTaskModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          newTask={newTask}
          onChange={handleChange}
          onAdd={addTaskToDb}
          onReset={resetTaskForm}
        />
        <EditModal
          isOpen={showEditModal}
          task={editTask}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateTask}
        />
      </div>
    </div>
  )
}

export default Home
