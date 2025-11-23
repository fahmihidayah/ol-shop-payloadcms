import { ProfilePage } from '@/modules/user/templates/profile-page'
import { updateProfile, updatePassword } from '@/modules/user/actions'

export default function Profile() {
  return <ProfilePage onUpdateProfile={updateProfile} onUpdatePassword={updatePassword} />
}
