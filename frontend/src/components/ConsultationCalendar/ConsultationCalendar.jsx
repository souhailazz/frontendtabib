import React, { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import fr from 'date-fns/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './ConsultationCalendar.css';

const locales = { fr };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const ConsultationCalendar = ({ consultations }) => {
  const [view, setView] = useState('week');
  const [date, setDate] = useState(new Date());
  const [jumpDate, setJumpDate] = useState(null);

  const events = useMemo(() => {
    return consultations.map((consultation) => ({
      id: consultation.id,
      title: `Consultation with ${consultation.patient?.prenom} ${consultation.patient?.nom}`,
      start: new Date(consultation.dateConsultation),
      end: new Date(new Date(consultation.dateConsultation).getTime() + 60 * 60 * 1000),
      status: consultation.etat,
      patient: consultation.patient,
      doctor: consultation.docteur,
    }));
  }, [consultations]);

  const eventPropGetter = (event) => {
    let backgroundColor = '#e0f2fe';
    let borderColor = '#0369a1';

    switch (event.status) {
      case 'PENDING':
        backgroundColor = '#fff3cd';
        borderColor = '#856404';
        break;
      case 'ACCEPTED':
        backgroundColor = '#d1fae5';
        borderColor = '#065f46';
        break;
      case 'COMPLETED':
        backgroundColor = '#e0f2fe';
        borderColor = '#0369a1';
        break;
      case 'DENIED':
        backgroundColor = '#fee2e2';
        borderColor = '#991b1b';
        break;
      default:
        break;
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderWidth: '2px',
        borderRadius: '4px',
        opacity: 0.8,
        color: '#1f2937',
        border: '0 none',
        display: 'block',
      },
    };
  };

  const EventComponent = ({ event }) => (
    <div className="custom-event">
      <div className="event-title">{event.title}</div>
      <div className="event-status">{event.status}</div>
      <div className="event-time">
        {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
      </div>
    </div>
  );

  const onDateChange = (e) => {
    const selected = e.target.value;
    if (selected) {
      setDate(new Date(selected));
      setJumpDate(selected);
    }
  };

  return (
    <div className="consultation-calendar">
      <h2 className="calendar-title">Consultation Calendar</h2>
      
      <div className="calendar-controls-container">
        <div className="calendar-controls">
          <input
            type="date"
            value={jumpDate || ''}
            onChange={onDateChange}
            className="jump-date-input"
            aria-label="Jump to date"
          />

          <select value={view} onChange={(e) => setView(e.target.value)} className="view-select">
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
            <option value="agenda">Agenda</option>
          </select>
        </div>
      </div>

      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          eventPropGetter={eventPropGetter}
          components={{ event: EventComponent }}
          popup
          selectable
          style={{ height: 'calc(100vh - 200px)' }}
        />
      </div>
    </div>
  );
};

export default ConsultationCalendar;