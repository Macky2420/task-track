import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { DatePicker, message } from 'antd'
import moment from 'moment'
import { auth, database } from '../database/firebaseConfig'
import { ref, push } from 'firebase/database'

const AddTaskModal = ({ isOpen, onClose, newTask, onChange, onReset }) => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Push new task to Firebase
      const tasksRef = ref(database, `users/${user.uid}/tasks`)
      await push(tasksRef, {
        ...newTask,
        createdAt: new Date().toISOString(),
        status: 'To Do',
        progress: 0
      })

      message.success('Task added successfully!')
      onReset();
      onClose();
    } catch (error) {
      console.error('Error adding task:', error)
      message.error(`Failed to add task: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (date, dateString) => {
    onChange({ target: { name: 'dueDate', value: dateString } })
  }

  if (!isOpen) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Add New Task</h3>
          <button 
            onClick={onClose} 
            className="btn btn-circle btn-sm"
            aria-label="Close modal"
            disabled={loading}
          >
            <FaTimes className="text-lg" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Input */}
          <div className="form-control w-full">
            <label className="label" htmlFor="title">
              <span className="label-text font-medium">Title</span>
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={newTask.title}
              onChange={onChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Description Input */}
          <div className="form-control w-full">
            <label className="label" htmlFor="description">
              <span className="label-text font-medium">Description</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={newTask.description}
              onChange={onChange}
              className="textarea textarea-bordered w-full h-32"
            />
          </div>

          {/* Priority Select */}
          <div className="form-control w-full">
            <label className="label" htmlFor="priority">
              <span className="label-text font-medium">Priority</span>
            </label>
            <select
              id="priority"
              name="priority"
              value={newTask.priority}
              onChange={onChange}
              className="select select-bordered w-full"
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Ant Design Date Picker */}
          <div className="form-control w-full">
            <label className="label" htmlFor="dueDate">
              <span className="label-text font-medium">Due Date</span>
            </label>
            <DatePicker
              id="dueDate"
              className="w-full"
              format="YYYY-MM-DD"
              value={newTask.dueDate ? moment(newTask.dueDate) : null}
              onChange={handleDateChange}
              disabledDate={(current) => current && current < moment().startOf('day')}
              getPopupContainer={(trigger) => trigger.parentElement}
            />
          </div>

          {/* Form Actions */}
          <div className="modal-action mt-8 flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-outline flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`btn btn-primary flex-1 ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTaskModal