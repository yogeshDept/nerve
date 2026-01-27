import { useEffect, useRef, useState } from 'react';
import './App.css';
import Button from './components/Button';
import { dateArray, strategyArray } from './constants';

const views = [
  { id: 'Bullish', label: 'Bullish' },
  { id: 'Bearish', label: 'Bearish' },
  { id: 'RangeBound', label: 'Rangebound' },
  { id: 'Volatile', label: 'Volatile' }
];

const formatDate = (value) => {
  if (!value) return '';
  const [day, month, year] = value.split('-');
  return `${day} ${month} ${year}`;
};

function App() {
  const [selectedView, setSelectedView] = useState(views[0].id);
  const [selectedDate, setSelectedDate] = useState(dateArray[0]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const viewData = strategyArray.find((item) => item.View === selectedView);
  const list = viewData?.Value?.[selectedDate] ?? [];
  const counts = new Map();

  list.forEach((name) => {
    counts.set(name, (counts.get(name) ?? 0) + 1);
  });

  const strategies = Array.from(counts, ([name, count]) => ({ name, count }));

  const formattedDate = formatDate(selectedDate);
  const activeIndex = Math.max(
    0,
    views.findIndex((view) => view.id === selectedView)
  );

  return (
    <div className="app">
      <section className="panel">
        <div className="view-toggle" style={{ '--active-index': activeIndex }}>
          <span className="view-toggle__indicator" aria-hidden="true" />
          {views.map((view) => (
            <Button
              key={view.id}
              className={`view-toggle__button ${
                view.id === selectedView ? 'is-active' : ''
              }`}
              type="button"
              onClick={() => setSelectedView(view.id)}
            >
              {view.label}
            </Button>
          ))}
        </div>

        <div className="date-dropdown" ref={dropdownRef}>
          <Button
            className="date-dropdown__toggle"
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
          >
            <span>{formattedDate}</span>
            <span
              className={`chevron ${isOpen ? 'is-open' : ''}`}
              aria-hidden="true"
            />
          </Button>
          {isOpen ? (
            <div className="date-dropdown__menu" role="listbox">
              {dateArray.map((date) => {
                const isSelected = date === selectedDate;
                return (
                  <Button
                    key={date}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`date-dropdown__option ${
                      isSelected ? 'is-selected' : ''
                    }`}
                    onClick={() => {
                      setSelectedDate(date);
                      setIsOpen(false);
                    }}
                  >
                    {formatDate(date)}
                  </Button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="strategy-list">
          {strategies.length === 0 ? (
            <div className="empty-state">
              <span>There are no strategies for</span>
              <strong>{formattedDate}</strong>
            </div>
          ) : (
            strategies.map((strategy, index) => (
              <div
                key={strategy.name}
                className="strategy-card"
                style={{ '--delay': `${index * 90}ms` }}
              >
                <span className="strategy-card__name">{strategy.name}</span>
                <span className="strategy-card__count">
                  <span className="dot" aria-hidden="true" />
                  {strategy.count}{' '}
                  {strategy.count === 1 ? 'Strategy' : 'Strategies'}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
