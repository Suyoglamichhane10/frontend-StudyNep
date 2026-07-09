import { useEffect, useMemo, useState } from 'react';
import {
  FaBookOpen,
  FaCalendarAlt,
  FaChartLine,
  FaClock,
  FaExclamationCircle,
  FaFlag,
  FaLayerGroup,
} from 'react-icons/fa';
import { getSubjects } from '../services/subjectService';
import './Schedule.css';

function Schedule() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('week');

  const timeSlots = useMemo(
    () => ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'],
    []
  );

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await getSubjects();
        const subjectList = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setSubjects(subjectList);
      } catch (err) {
        console.error('Error loading schedule subjects:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load schedule data');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const getDaysLeft = (examDate) => {
    if (!examDate) return null;
    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);

    return Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
  };

  const getPriorityWeight = (priority) => {
    const weights = { High: 3, Medium: 2, Low: 1 };
    return weights[priority] || 2;
  };

  const getPriorityClass = (priority = 'Medium') => `priority-${priority.toLowerCase()}`;

  const getDeadlineLabel = (daysLeft) => {
    if (daysLeft === null) return 'No exam date';
    if (daysLeft < 0) return `${Math.abs(daysLeft)} days overdue`;
    if (daysLeft === 0) return 'Exam today';
    if (daysLeft === 1) return 'Tomorrow';
    return `${daysLeft} days left`;
  };

  const activeSubjects = useMemo(
    () =>
      subjects
        .filter((subject) => !subject.completed)
        .map((subject) => ({
          ...subject,
          daysLeft: getDaysLeft(subject.examDate),
          hoursPerDay: Number(subject.hoursPerDay) || 1,
        })),
    [subjects]
  );

  const upcomingSubjects = useMemo(
    () =>
      activeSubjects
        .filter((subject) => subject.daysLeft !== null && subject.daysLeft >= 0)
        .sort((a, b) => {
          if (a.daysLeft === b.daysLeft) {
            return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
          }
          return a.daysLeft - b.daysLeft;
        }),
    [activeSubjects]
  );

  const overdueSubjects = useMemo(
    () =>
      activeSubjects
        .filter((subject) => subject.daysLeft !== null && subject.daysLeft < 0)
        .sort((a, b) => a.daysLeft - b.daysLeft),
    [activeSubjects]
  );

  const calendarDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() + index);

        return {
          dateKey: date.toISOString().slice(0, 10),
          day: date.toLocaleDateString('en-US', { weekday: 'long' }),
          shortDay: date.toLocaleDateString('en-US', { weekday: 'short' }),
          displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          isToday: index === 0,
          sessions: [],
        };
      }),
    [today]
  );

  const scheduleDays = useMemo(() => {
    const days = calendarDays.map((day) => ({ ...day, sessions: [] }));

    upcomingSubjects.forEach((subject) => {
      const preferredDay = Math.min(6, Math.max(0, subject.daysLeft));
      let targetDay = preferredDay;

      for (let offset = 0; offset < days.length; offset += 1) {
        const candidate = Math.min(6, preferredDay + offset);
        if (days[candidate].sessions.length < timeSlots.length) {
          targetDay = candidate;
          break;
        }
      }

      const slotIndex = days[targetDay].sessions.length;
      days[targetDay].sessions.push({
        id: subject._id || `${subject.name}-${days[targetDay].dateKey}-${slotIndex}`,
        subject: subject.name,
        duration: `${subject.hoursPerDay}h`,
        priority: subject.priority || 'Medium',
        examDate: subject.examDate ? new Date(subject.examDate).toLocaleDateString() : 'TBD',
        daysLeft: subject.daysLeft,
        time: timeSlots[slotIndex] || 'Flexible',
        description: subject.description,
      });
    });

    return days;
  }, [calendarDays, timeSlots, upcomingSubjects]);

  const visibleDays = view === 'today' ? scheduleDays.filter(({ isToday }) => isToday) : scheduleDays;
  const completedCount = subjects.filter((subject) => subject.completed).length;
  const weeklyHours = upcomingSubjects.reduce((total, subject) => total + subject.hoursPerDay, 0);
  const urgentCount = upcomingSubjects.filter((subject) => subject.daysLeft <= 3).length;
  const totalSessions = scheduleDays.reduce((total, day) => total + day.sessions.length, 0);
  const completionRate = subjects.length ? Math.round((completedCount / subjects.length) * 100) : 0;
  const busiestDay = scheduleDays.reduce(
    (busiest, day) => (day.sessions.length > busiest.sessions.length ? day : busiest),
    { day: 'None', sessions: [] }
  );
  const nextExam = upcomingSubjects[0];

  if (loading) {
    return (
      <div className="schedule-loading">
        <div className="schedule-spinner" />
        <p>Building your study schedule...</p>
      </div>
    );
  }

  if (error) {
    return (
      <main className="student-scheduler">
        <section className="scheduler-empty">
          <FaExclamationCircle />
          <h2>Unable to load schedule</h2>
          <p>{error}</p>
          <p>Please make sure you are logged in and try again.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="student-scheduler">
      <div className="scheduler-header">
        <div>
          <span className="scheduler-kicker">STUDENT SCHEDULER</span>
          <h1>Weekly Study Schedule</h1>
          <p>{currentDate}</p>
        </div>

        <div className="scheduler-switch" aria-label="Schedule view">
          <button className={view === 'week' ? 'active' : ''} onClick={() => setView('week')} type="button">
            Week
          </button>
          <button className={view === 'today' ? 'active' : ''} onClick={() => setView('today')} type="button">
            Today
          </button>
        </div>
      </div>

      <div className="scheduler-stats" aria-label="Schedule summary">
        <div className="scheduler-stat">
          <FaLayerGroup />
          <div>
            <strong>{totalSessions}</strong>
            <span>Sessions</span>
          </div>
        </div>
        <div className="scheduler-stat">
          <FaClock />
          <div>
            <strong>{weeklyHours}h</strong>
            <span>Total study</span>
          </div>
        </div>
        <div className="scheduler-stat">
          <FaFlag />
          <div>
            <strong>{urgentCount}</strong>
            <span>Due soon</span>
          </div>
        </div>
        <div className="scheduler-stat">
          <FaChartLine />
          <div>
            <strong>{completionRate}%</strong>
            <span>Complete</span>
          </div>
        </div>
      </div>

      <div className="scheduler-layout">
        <div className="agenda-board">
          <div className="agenda-board-header">
            <div>
              <h2>{view === 'today' ? "Today's Plan" : 'This Week'}</h2>
              <p>{view === 'today' ? 'Focused sessions for the current day.' : 'A clean overview of your upcoming study blocks.'}</p>
            </div>
          </div>

          {upcomingSubjects.length === 0 ? (
            <div className="scheduler-empty">
              <FaBookOpen />
              <h3>No upcoming exams</h3>
              <p>Add subjects with future exam dates in Study Planner to generate your schedule.</p>
            </div>
          ) : (
            <div className={`agenda-grid ${view === 'today' ? 'single-day' : ''}`}>
              {visibleDays.map(({ dateKey, day, shortDay, displayDate, isToday, sessions }) => (
                <article className={`agenda-day ${isToday ? 'is-today' : ''}`} key={dateKey}>
                  <header>
                    <div>
                      <span>{shortDay}</span>
                      <h3>{day}</h3>
                      <small>{displayDate}</small>
                    </div>
                    {isToday && <strong>Today</strong>}
                  </header>

                  <div className="session-stack">
                    {sessions.length === 0 ? (
                      <div className="quiet-slot">No study blocks</div>
                    ) : (
                      sessions.map((session) => (
                        <div className={`study-session ${getPriorityClass(session.priority)}`} key={session.id}>
                          <div className="session-time">
                            <FaClock />
                            <span>{session.time}</span>
                          </div>
                          <h4>{session.subject}</h4>
                          <div className="session-meta">
                            <span>{session.duration}</span>
                            <span>{getDeadlineLabel(session.daysLeft)}</span>
                          </div>
                          <div className="session-footer">
                            <span>{session.priority} priority</span>
                            <span>Exam {session.examDate}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="scheduler-sidebar">
          <section className="insight-panel">
            <h2>Focus Snapshot</h2>
            <div className="insight-list">
              <div>
                <span>Next exam</span>
                <strong>{nextExam ? nextExam.name : 'None scheduled'}</strong>
                <small>{nextExam ? getDeadlineLabel(nextExam.daysLeft) : 'Add a subject to begin'}</small>
              </div>
              <div>
                <span>Busiest day</span>
                <strong>{busiestDay.sessions.length ? busiestDay.day : 'No sessions'}</strong>
                <small>{busiestDay.sessions.length} planned sessions</small>
              </div>
              <div>
                <span>Active subjects</span>
                <strong>{activeSubjects.length}</strong>
                <small>{overdueSubjects.length} need date review</small>
              </div>
            </div>
          </section>

          <section className="insight-panel">
            <h2>Priority Key</h2>
            <div className="priority-key">
              <span className="priority-dot high" />
              <span>High priority</span>
              <span className="priority-dot medium" />
              <span>Medium priority</span>
              <span className="priority-dot low" />
              <span>Low priority</span>
            </div>
          </section>

          {overdueSubjects.length > 0 && (
            <section className="insight-panel overdue-panel">
              <h2>Needs Attention</h2>
              <div className="overdue-list">
                {overdueSubjects.map((subject) => (
                  <div key={subject._id || subject.name}>
                    <FaCalendarAlt />
                    <span>{subject.name}</span>
                    <strong>{getDeadlineLabel(subject.daysLeft)}</strong>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}

export default Schedule;