import React, { useState } from 'react'
import { auth } from '../database/firebaseConfig'
import { updatePassword, signOut } from 'firebase/auth'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'

const ChangePassModal = ({ isOpen, onClose, email }) => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleConfirmChangePassword = async () => {
    try {
      setLoading(true)
      setError('')

      if (!newPassword || !confirmPassword) {
        throw new Error('Please fill in all fields')
      }

      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match')
      }

      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      const user = auth.currentUser
      if (user) {
        await updatePassword(user, newPassword)
        message.success('Password updated successfully!')
        
        await signOut(auth)
        window.localStorage.clear()
        window.sessionStorage.clear()
        window.history.replaceState(null, '', '/')
        navigate('/', { replace: true })
        window.location.reload()
      }
    } catch (error) {
      setError(error.message)
      message.error(error.message)
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg mb-4">Change Password</h3>
        <div className="space-y-4">
          <div className="form-control">
            <label className="label" htmlFor="new-password">
              <span className="label-text">New Password</span>
            </label>
            <input
              id="new-password"
              type="password"
              className="input input-bordered w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              name="new-password"
              autoComplete="new-password"
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="confirm-password">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              id="confirm-password"
              type="password"
              className="input input-bordered w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              name="confirm-password"
              autoComplete="new-password"
            />
          </div>

          {error && <div className="text-error text-sm">{error}</div>}

          <div className="modal-action mt-6">
            <button 
              className="btn" 
              onClick={onClose} 
              disabled={loading}
              type="button"
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleConfirmChangePassword}
              disabled={loading}
              type="submit"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePassModal