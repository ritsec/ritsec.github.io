import React, { useState, useMemo } from "react";
import { formatDates } from "@/utils.js";

const isSameDay = (a, b) => {
    const opts = {
        timeZone: "America/New_York",
        year: "numeric",
        month: "numeric",
        day: "numeric",
    };
    const dateA = new Intl.DateTimeFormat("en-US", opts).format(a);
    const dateB = new Intl.DateTimeFormat("en-US", opts).format(b);
    return dateA === dateB;
};

function Schedule({
    data,
    group: lockedGroup,
    count,
    ascending,
    showOld,
    daysAhead,
}) {
    const getSemester = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = d.getMonth(); // 0 = Jan
        if (month >= 7) return `Fall ${year}`;
        else return `Spring ${year}`;
    };

    const semesters = useMemo(() => {
        const base = lockedGroup
            ? data.filter(
                  (e) =>
                      e.data.group.id.toLowerCase() ===
                      lockedGroup.toLowerCase(),
              )
            : data;
        const set = new Set(base.map((e) => getSemester(e.data.start)));
        return Array.from(set).sort((a, b) => {
            const [seasonA, yearA] = a.split(" ");
            const [seasonB, yearB] = b.split(" ");

            const valA = parseInt(yearA) * 10 + (seasonA === "Fall" ? 2 : 1);
            const valB = parseInt(yearB) * 10 + (seasonB === "Fall" ? 2 : 1);

            return valB - valA; // Descending (Newest first)
        });
    }, [data, lockedGroup]);

    const [selectedSemester, setSelectedSemester] = useState(semesters[0]);
    const [selectedGroup, setSelectedGroup] = useState("All");

    const filteredData = useMemo(() => {
        let d = [...data].sort((a, b) => a.data.start - b.data.start);

        if (lockedGroup) {
            d = d.filter(
                (a) =>
                    a.data.group.id.toLowerCase() === lockedGroup.toLowerCase(),
            );
        }

        if (!showOld) d = d.filter((a) => a.data.end > new Date());

        const sevenDaysFromNow = new Date().getTime() + daysAhead * 86400000;
        d = d.filter((a) => a.data.start < new Date(sevenDaysFromNow));
        d = d.filter((a) => getSemester(a.data.start) === selectedSemester);

        if (!lockedGroup && selectedGroup !== "All") {
            d = d.filter((a) => a.data.group.id === selectedGroup);
        }

        if (!ascending) d.reverse();
        return count ? d.slice(0, count) : d;
    }, [
        data,
        selectedSemester,
        selectedGroup,
        lockedGroup,
        ascending,
        showOld,
        count,
    ]);

    const availableGroups = useMemo(() => {
        const currentSet = data.filter(
            (e) => getSemester(e.data.start) === selectedSemester,
        );
        const set = new Set(currentSet.map((e) => e.data.group.id));
        return ["All", ...Array.from(set).sort()];
    }, [data, selectedSemester]);

    const now = new Date();

    return (
        <div className="schedule-wrapper">
            <div className="filter-controls">
                <label className="filter-label">
                    <span className="filter-text">Term:</span>
                    <div className="select-wrapper">
                        <select
                            value={selectedSemester}
                            onChange={(e) => {
                                setSelectedSemester(e.target.value);
                                setSelectedGroup("All");
                            }}
                            className="filter-select"
                        >
                            {semesters.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                </label>
                {!lockedGroup && (
                    <label className="filter-label">
                        <span className="filter-text">Group:</span>
                        <div className="select-wrapper">
                            <select
                                value={selectedGroup}
                                onChange={(e) =>
                                    setSelectedGroup(e.target.value)
                                }
                                className="filter-select"
                            >
                                {availableGroups.map((g) => (
                                    <option key={g} value={g}>
                                        {g.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </label>
                )}
            </div>
            {/* For icons, must include: */}
            <div className="list-stack">
                {filteredData.map((e) => {
                    const isOngoing =
                        now >= new Date(e.data.start) &&
                        now <= new Date(e.data.end);

                    // Helper to normalize to array
                    const toArray = (val) =>
                        Array.isArray(val) ? val : val ? [val] : [];
                    const slides = toArray(e.data.slide);
                    const videos = toArray(e.data.video);
                    const hasMedia = slides.length > 0 || videos.length > 0;

                    return (
                        <div
                            key={e.slug}
                            className={`card card-row ${isOngoing ? "active" : ""}`}
                        >
                            <div className="col-date">
                                {isSameDay(
                                    new Date(e.data.start),
                                    new Date(e.data.end),
                                ) ? (
                                    <>
                                        <div className="date-part">
                                            {new Intl.DateTimeFormat("en-US", {
                                                timeZone: "America/New_York",
                                                month: "short",
                                                day: "numeric",
                                            }).format(new Date(e.data.start))}
                                        </div>
                                        <div className="time-part">
                                            {new Intl.DateTimeFormat("en-US", {
                                                timeZone: "America/New_York",
                                                hour: "numeric",
                                                minute: "2-digit",
                                            }).format(new Date(e.data.start))}
                                            {" - "}
                                            {new Intl.DateTimeFormat("en-US", {
                                                timeZone: "America/New_York",
                                                hour: "numeric",
                                                minute: "2-digit",
                                            }).format(new Date(e.data.end))}
                                        </div>
                                    </>
                                ) : (
                                    formatDates(e.data.start, e.data.end, "\n")
                                )}
                            </div>

                            <div className="col-content">
                                <div className="card-header-row">
                                    <strong className="card-title">
                                        {e.data.title}
                                    </strong>
                                    <span className="badge">
                                        {e.data.group.id.toUpperCase()}
                                    </span>
                                </div>
                                <div className="meta-row">
                                    <div className="meta-item">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-map-pin"
                                        >
                                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                        <span>{e.data.location}</span>
                                    </div>
                                    <div className="meta-item italic">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-user"
                                        >
                                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        <span>{e.data.hosts.join(", ")}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-actions">
                                {hasMedia && (
                                    <div className="action-group">
                                        {slides.map((link, i) => (
                                            <a
                                                key={`slide-${i}`}
                                                className="icon-button"
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={`View Slides ${i + 1}`}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M2 3h20" />
                                                    <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
                                                    <path d="m7 21 5-5 5 5" />
                                                </svg>
                                            </a>
                                        ))}
                                        {videos.map((link, i) => (
                                            <a
                                                key={`video-${i}`}
                                                className="icon-button"
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={`Watch Video ${i + 1}`}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
                                                    <rect
                                                        x="2"
                                                        y="6"
                                                        width="14"
                                                        height="12"
                                                        rx="2"
                                                    />
                                                </svg>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                {filteredData.length === 0 && (
                    <div className="empty-state">
                        No events found for this selection.
                    </div>
                )}
            </div>
        </div>
    );
}

export default Schedule;
