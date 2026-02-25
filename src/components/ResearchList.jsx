import React, { useState, useMemo } from "react";
import { formatDate } from "@/utils.js";

function ResearchList({ data, group: lockedGroup, count, ascending }) {
    const getYear = (date) => {
        const d = new Date(date);
        return d.getUTCFullYear().toString();
    };

    const years = useMemo(() => {
        const base = lockedGroup
            ? data.filter(
                  (e) =>
                      e.data.group?.id.toLowerCase() ===
                      lockedGroup.toLowerCase(),
              )
            : data;
        const set = new Set(base.map((e) => getYear(e.data.date)));
        return [...Array.from(set).sort().reverse()];
    }, [data, lockedGroup]);

    const [selectedYear, setSelectedYear] = useState(years[0] || "All");
    const [selectedGroup, setSelectedGroup] = useState("All");
    const [selectedType, setSelectedType] = useState("All Types");

    const filteredData = useMemo(() => {
        let d = [...data].sort(
            (a, b) => new Date(a.data.date) - new Date(b.data.date),
        );

        if (lockedGroup) {
            d = d.filter(
                (a) =>
                    a.data.group?.id.toLowerCase() ===
                    lockedGroup.toLowerCase(),
            );
        }

        if (selectedYear !== "All") {
            d = d.filter((a) => getYear(a.data.date) === selectedYear);
        }

        if (!lockedGroup && selectedGroup !== "All") {
            d = d.filter((a) => a.data.group?.id === selectedGroup);
        }

        if (selectedType !== "All Types") {
            if (selectedType === "Article") {
                d = d.filter((a) => a.data.hasContent);
            } else if (selectedType === "Video") {
                d = d.filter((a) => a.data.video);
            } else if (selectedType === "Slideshow") {
                d = d.filter((a) => a.data.slideshow);
            }
        }

        if (!ascending) d.reverse();
        return count ? d.slice(0, count) : d;
    }, [
        data,
        selectedYear,
        selectedGroup,
        selectedType,
        lockedGroup,
        ascending,
        count,
    ]);

    const availableGroups = useMemo(() => {
        const currentSet =
            selectedYear === "All"
                ? data
                : data.filter((e) => getYear(e.data.date) === selectedYear);

        const set = new Set(
            currentSet.map((e) => e.data.group?.id).filter(Boolean),
        );
        return ["All", ...Array.from(set).sort()];
    }, [data, selectedYear]);

    return (
        <div className="research-wrapper">
            <div className="filter-controls">
                <label className="filter-label">
                    <span className="filter-text">Year:</span>
                    <div className="select-wrapper">
                        <select
                            value={selectedYear}
                            onChange={(e) => {
                                setSelectedYear(e.target.value);
                                setSelectedGroup("All");
                            }}
                            className="filter-select"
                        >
                            <option value="All">All Years</option>
                            {years.map((y) => (
                                <option key={y} value={y}>
                                    {y}
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
                                        {g === "All"
                                            ? "All Groups"
                                            : g.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </label>
                )}
                <label className="filter-label">
                    <span className="filter-text">Type:</span>
                    <div className="select-wrapper">
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="filter-select"
                        >
                            {["All Types", "Article", "Video", "Slideshow"].map(
                                (t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ),
                            )}
                        </select>
                    </div>
                </label>
            </div>

            <div className="list-stack">
                {filteredData.map((post) => (
                    <a
                        key={post.slug}
                        href={`${import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL.replace(/\/$/, "")}/research/${post.slug}`}
                        className="card card-row"
                    >
                        <div className="col-date">
                            <time
                                dateTime={new Date(
                                    post.data.date,
                                ).toISOString()}
                            >
                                {formatDate(new Date(post.data.date))}
                            </time>
                        </div>

                        <article className="col-content">
                            <div className="card-header-row">
                                <strong className="card-title">
                                    {post.data.title}
                                </strong>
                                {post.data.group && (
                                    <span className="badge">
                                        {post.data.group.id.toUpperCase()}
                                    </span>
                                )}
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
                                        className="lucide lucide-users"
                                    >
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                    {post.data.authors.length > 0 ? (
                                        <span>
                                            {post.data.authors
                                                .map((a) => a.name)
                                                .join(", ")}
                                        </span>
                                    ) : (
                                        <span>RITSEC</span>
                                    )}
                                </div>
                            </div>
                        </article>

                        <div className="col-actions">
                            <div className="action-group">
                                {post.data.hasContent && (
                                    <div
                                        className="icon-button"
                                        title="Article"
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
                                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line
                                                x1="16"
                                                x2="8"
                                                y1="13"
                                                y2="13"
                                            />
                                            <line
                                                x1="16"
                                                x2="8"
                                                y1="17"
                                                y2="17"
                                            />
                                            <line
                                                x1="10"
                                                x2="8"
                                                y1="9"
                                                y2="9"
                                            />
                                        </svg>
                                    </div>
                                )}
                                {post.data.video && (
                                    <div className="icon-button" title="Video">
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
                                            <path d="m22 8-6 4 6 4V8Z" />
                                            <rect
                                                width="14"
                                                height="12"
                                                x="2"
                                                y="6"
                                                rx="2"
                                                ry="2"
                                            />
                                        </svg>
                                    </div>
                                )}
                                {post.data.slideshow && (
                                    <div
                                        className="icon-button"
                                        title="Slideshow"
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
                                            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                                            <path d="M18 14h-8" />
                                            <path d="M15 18h-5" />
                                            <path d="M10 6h8v4h-8V6Z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    </a>
                ))}

                {filteredData.length === 0 && (
                    <div className="empty-state">
                        No research found, please check again later.
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResearchList;
