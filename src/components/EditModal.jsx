import React, { useState, useEffect } from 'react'

const EditModal = ({ isOpen, task, onClose, onUpdate }) => {
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '' })

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate
      })
    }
  }, [task])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    onUpdate({ ...form, id: task.id })
  }

  return (
    <>  
      <input
        type="checkbox"
        id="edit-modal"
        className="modal-toggle"
        checked={isOpen}
        readOnly
      />
      <label htmlFor="edit-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="font-bold text-lg">Edit Task</h3>
          <div className="space-y-4 pt-4">
            <input
              type="text"
              name="title"
              placeholder="Title"
              className="input input-bordered w-full"
              value={form.title}
              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              className="textarea textarea-bordered w-full"
              value={ form.description }
              onChange={ handleChange }
            />
            <select
              name="priority"
              className="select select-bordered w-full"
              value={ form.priority }
              onChange={ handleChange }
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <input
              type="date"
              name="dueDate"
              className="input input-bordered w-full"
              value={ form.dueDate }
              onChange={ handleChange }
            />
          </div>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={ handleSave }>Save</button>
            <button className="btn btn-ghost" onClick={ onClose }>Cancel</button>
          </div>
        </label>
      </label>
    </>
  )
}

export default EditModal
