import { describe, it, expect } from 'vitest';
import eventsData from '../data/events.json';

describe('Events Data', () => {
  it('should have 10 events', () => {
    expect(eventsData.length).toBe(10);
  });

  it('should contain CS events', () => {
    const csEvents = eventsData.filter(e => e.category === 'CS');
    expect(csEvents.length).toBeGreaterThan(0);
  });

  it('each event should have a regLink', () => {
    eventsData.forEach(event => {
      expect(event.regLink).toBeDefined();
      expect(event.regLink).toContain('http');
    });
  });
});
