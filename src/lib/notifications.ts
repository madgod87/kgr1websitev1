import { supabaseAdmin } from './supabase'
import { Notification } from './supabase'

export interface NotificationForm {
  title: string
  content: string
}

export interface NotificationResult {
  success: boolean
  notification?: Notification
  error?: string
}

export async function createNotification(
  adminId: string,
  data: NotificationForm
): Promise<NotificationResult> {
  try {
    const { data: notification, error } = await supabaseAdmin
      .from('notifications')
      .insert([
        {
          title: data.title,
          content: data.content,
          created_by: adminId,
          is_active: true
        }
      ])
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: 'Failed to create notification'
      }
    }

    return {
      success: true,
      notification: notification as Notification
    }
  } catch (error) {
    console.error('Create notification error:', error)
    return {
      success: false,
      error: 'Failed to create notification'
    }
  }
}

export async function updateNotification(
  notificationId: string,
  data: Partial<NotificationForm & { is_active: boolean }>
): Promise<NotificationResult> {
  try {
    const { data: notification, error } = await supabaseAdmin
      .from('notifications')
      .update(data)
      .eq('id', notificationId)
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: 'Failed to update notification'
      }
    }

    return {
      success: true,
      notification: notification as Notification
    }
  } catch (error) {
    console.error('Update notification error:', error)
    return {
      success: false,
      error: 'Failed to update notification'
    }
  }
}

export async function deleteNotification(notificationId: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', notificationId)

    return !error
  } catch (error) {
    console.error('Delete notification error:', error)
    return false
  }
}

export async function getAllNotifications(): Promise<Notification[]> {
  try {
    const { data: notifications, error } = await supabaseAdmin
      .from('notifications')
      .select(`
        *,
        admins!notifications_created_by_fkey(userid)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get notifications error:', error)
      return []
    }

    return notifications as Notification[]
  } catch (error) {
    console.error('Get notifications error:', error)
    return []
  }
}

export async function getActiveNotifications(): Promise<Notification[]> {
  try {
    const { data: notifications, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get active notifications error:', error)
      return []
    }

    return notifications as Notification[]
  } catch (error) {
    console.error('Get active notifications error:', error)
    return []
  }
}
