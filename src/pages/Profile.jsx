import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { auth, database } from '../database/firebaseConfig'
import { onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth'
import { ref, onValue, off } from 'firebase/database'
import { message } from 'antd'
import { FaEnvelope, FaVenusMars, FaBriefcase } from 'react-icons/fa'

const UserInfo = () => {
  const { userId } = useParams()
  const [profile, setProfile] = useState({ fullName: '', email: '', gender: '', job: '', avatar: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen to auth for email
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) setProfile(prev => ({ ...prev, email: user.email }))
    })

    // Fetch profile from Realtime DB
    const profileRef = ref(database, `users/${userId}`)
    const listener = onValue(profileRef, (snapshot) => {
      const data = snapshot.val() || {}
      setProfile({
        fullName: data.fullName || '',
        email: data.email || profile.email,
        gender: data.gender || '',
        job: data.job || '',
        avatar: data.avatar || `https://i.pravatar.cc/150?u=${userId}`
      })
      setLoading(false)
    })

    return () => {
      unsubscribeAuth()
      off(profileRef, 'value', listener)
    }
  }, [userId])

  const handleChangePassword = async () => {
    try {
      await sendPasswordResetEmail(auth, profile.email)
      message.success('Password reset email sent successfully')
    } catch (error) {
      message.error(error.message)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-full">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  )

  return (
    <div className="flex justify-center p-8">
      <div className="card w-full max-w-md bg-base-100 shadow-lg">
        <div className="card-body items-center text-center">
          {/* Avatar */}
          <div className="avatar mb-4">
            <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
              <img src={profile.avatar} alt="Profile avatar" />
            </div>
          </div>
          {/* Full Name */}
          <h2 className="text-2xl font-bold mb-1">{profile.fullName || 'Anonymous'}</h2>
          {/* Job with Icon */}
          <div className="flex items-center text-gray-500 mb-4 gap-2">
            <FaBriefcase />
            <span>{profile.job || 'No Job Specified'}</span>
          </div>
          {/* Details */}
          <div className="grid grid-cols-1 gap-4 w-full text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-gray-500" />
                <span className="font-medium">Email:</span>
              </div>
              <span className="text-gray-600">{profile.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaVenusMars className="text-gray-500" />
                <span className="font-medium">Gender:</span>
              </div>
              <span className="text-gray-600 capitalize">{profile.gender || 'Unspecified'}</span>
            </div>
          </div>
          {/* Actions */}
          <div className="card-actions mt-6 w-full">
            <button className="btn btn-primary btn-block" onClick={handleChangePassword}>
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfo