import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatTime = (date) => {
  if (!date) return 'N/A';
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    return format(parsed, 'h:mm a');
  } catch (error) {
    return 'Invalid time';
  }
};

export const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    return format(parsed, 'MMM d, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    return format(parsed, 'MMM d, yyyy h:mm a');
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatTimeAgo = (date) => {
  if (!date) return 'N/A';
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(parsed, { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatDuration = (minutes) => {
  if (minutes == null || isNaN(minutes)) return 'N/A';
  
  const totalMinutes = Math.round(minutes);
  
  if (totalMinutes < 1) {
    return 'Less than 1 min';
  } else if (totalMinutes === 1) {
    return '1 min';
  } else if (totalMinutes < 60) {
    return `${totalMinutes} mins`;
  } else {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
};

export const formatDistance = (meters) => {
  if (meters == null || isNaN(meters)) return 'N/A';
  
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  } else {
    return `${(meters / 1000).toFixed(1)} km`;
  }
};

export const formatSpeed = (kmph) => {
  if (kmph == null || isNaN(kmph)) return '0 km/h';
  return `${Math.round(kmph)} km/h`;
};

export const getSeverityColor = (severity) => {
  const colors = {
    low: 'blue',
    medium: 'yellow',
    high: 'orange',
    urgent: 'red',
  };
  return colors[severity] || 'gray';
};

export const getStatusColor = (status) => {
  const colors = {
    open: 'blue',
    in_progress: 'yellow',
    resolved: 'green',
    closed: 'gray',
    rejected: 'red',
    active: 'green',
    inactive: 'gray',
    maintenance: 'orange',
  };
  return colors[status] || 'gray';
};
