"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  end?: string;
};

type EventEditorState = {
  events: CalendarEvent[];
};

type EventEditorProps = {
  initialEvents: CalendarEvent[];
  upsertEvent: (
    prevState: EventEditorState,
    formData: FormData
  ) => Promise<EventEditorState>;
};

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
    >
      {pending ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
    </button>
  );
}

export default function EventEditor({
  initialEvents,
  upsertEvent,
}: EventEditorProps) {
  const [state, formAction] = React.useActionState(upsertEvent, {
    events: initialEvents,
  });
  const events = state.events;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedEvent =
    selectedId ? events.find((event) => event.id === selectedId) : null;
  const formKey = selectedEvent?.id ?? "new";
  const [dateValue, setDateValue] = useState<string>(selectedEvent?.date ?? "");
  const [endValue, setEndValue] = useState<string>(selectedEvent?.end ?? "");

  useEffect(() => {
    if (selectedId && !events.some((event) => event.id === selectedId)) {
      setSelectedId(null);
    }
  }, [events, selectedId]);

  useEffect(() => {
    setDateValue(selectedEvent?.date ?? "");
    setEndValue(selectedEvent?.end ?? "");
  }, [selectedEvent]);

  const selectedRange = useMemo(() => {
    if (!selectedEvent) {
      return "";
    }
    return selectedEvent.end
      ? `${selectedEvent.date} - ${selectedEvent.end}`
      : selectedEvent.date;
  }, [selectedEvent]);

  const endMinDate = useMemo(() => {
    if (!dateValue) {
      return undefined;
    }
    const base = new Date(`${dateValue}T00:00:00`);
    if (Number.isNaN(base.getTime())) {
      return undefined;
    }
    base.setDate(base.getDate() + 1);
    return base.toISOString().split("T")[0];
  }, [dateValue]);

  const isEndInvalid =
    Boolean(endValue) && Boolean(dateValue) && endValue <= dateValue;

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Events</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className={[
              "px-4 py-2 rounded-md border text-sm whitespace-nowrap",
              selectedEvent
                ? "border-gray-300 text-gray-600 hover:border-gray-400"
                : "border-green-600 text-green-700 bg-green-50",
            ].join(" ")}
          >
            + New Event
          </button>
          {events.map((event) => {
            const isSelected = event.id === selectedId;
            return (
              <button
                key={event.id}
                type="button"
                onClick={() => setSelectedId(event.id)}
                className={[
                  "px-4 py-2 rounded-md border text-left whitespace-nowrap",
                  isSelected
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:border-gray-400",
                ].join(" ")}
              >
                <div className="font-semibold">{event.title}</div>
                <div className="text-xs text-gray-500">
                  {event.end ? `${event.date} - ${event.end}` : event.date}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {selectedEvent ? "Edit Event" : "Create Event"}
        </h3>
        <form key={formKey} action={formAction} className="space-y-4">
          <input type="hidden" name="actionType" value="upsert" />
          <input type="hidden" name="eventId" value={selectedEvent?.id ?? ""} />
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              defaultValue={selectedEvent?.title ?? ""}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="date"
              defaultValue={selectedEvent?.date ?? ""}
              onChange={(event) => setDateValue(event.target.value)}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              End Date (Optional)
            </label>
            <input
              type="date"
              name="end"
              defaultValue={selectedEvent?.end ?? ""}
              onChange={(event) => setEndValue(event.target.value)}
              min={endMinDate}
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave blank for a one-day event.
            </p>
            {isEndInvalid && (
              <p className="mt-1 text-sm text-red-600">
                End date must be after the start date.
              </p>
            )}
          </div>
          <SubmitButton isEdit={Boolean(selectedEvent)} />
          {selectedRange && (
            <p className="text-sm text-gray-500">
              Selected: {selectedRange}
            </p>
          )}
        </form>
        {selectedEvent && (
          <form action={formAction} className="mt-4">
            <input type="hidden" name="actionType" value="delete" />
            <input type="hidden" name="eventId" value={selectedEvent.id} />
            <button
              type="submit"
              className="rounded-md border border-red-600 px-6 py-3 font-semibold text-red-600 transition hover:bg-red-50"
            >
              Delete Event
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
