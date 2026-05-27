/**
 * Date Formatting Utilities
 * -------------------------
 * Centralized date formatting functions using date-fns.
 * Keeps date display consistent across the entire application.
 */

import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

/**
 * Format a date string into a readable format.
 * Example: "May 27, 2026"
 */
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  if (!isValid(date)) return '—';
  return format(date, 'MMM d, yyyy');
};

/**
 * Format a date string into date + time.
 * Example: "May 27, 2026 at 2:30 PM"
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  if (!isValid(date)) return '—';
  return format(date, "MMM d, yyyy 'at' h:mm a");
};

/**
 * Format a date as relative time.
 * Example: "3 hours ago", "2 days ago"
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '—';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  if (!isValid(date)) return '—';
  return formatDistanceToNow(date, { addSuffix: true });
};

/**
 * Format a date for chart axis labels.
 * Example: "May 27"
 */
export const formatChartDate = (dateString) => {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  if (!isValid(date)) return '';
  return format(date, 'MMM d');
};
