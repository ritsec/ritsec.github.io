function isSameDay(a, b) {
    const opts = {
        timeZone: "America/New_York",
        year: "numeric",
        month: "numeric",
        day: "numeric",
    };
    const dateA = new Intl.DateTimeFormat("en-US", opts).format(a);
    const dateB = new Intl.DateTimeFormat("en-US", opts).format(b);
    return dateA === dateB;
}

function isMidnight(a) {
    return a.getUTCHours() === 0 && a.getUTCMinutes() === 0;
}

export function formatDate(date) {
    return new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
}

export const formatDates = (start, end, separator = " • ") => {
    /* We leave all the dates as UTC because that's what the
     * parsing defaults to, and is it NOT fun to deal with dates in JS... */
    const dateOpts = {
        timeZone: "America/New_York",
        month: "short",
        day: "numeric",
    };

    const timeOpts = {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "2-digit",
    };

    const startTime = new Intl.DateTimeFormat("en-US", timeOpts).format(start);
    const endTime = new Intl.DateTimeFormat("en-US", timeOpts).format(end);

    if (isSameDay(start, end)) {
        const date = new Intl.DateTimeFormat("en-US", dateOpts).format(start);

        if (isMidnight(start) && isMidnight(end)) {
            return date;
        }

        return `${date}${separator}${formatTime(startTime, endTime)}`;
    } else {
        const s = new Intl.DateTimeFormat("en-US", dateOpts).format(start);
        const e = new Intl.DateTimeFormat("en-US", dateOpts).format(end);
        return formatTime(s, e);
    }
};

export function formatTime(start, end) {
    return `${start} - ${end}`;
}

export function getEmbedUrl(url) {
    if (!url) return null;

    try {
        const u = new URL(url);

        // YouTube
        if (
            u.hostname.includes("youtube.com") ||
            u.hostname.includes("youtu.be")
        ) {
            let videoId = null;
            if (u.hostname.includes("youtu.be")) {
                videoId = u.pathname.slice(1);
            } else if (u.searchParams.has("v")) {
                videoId = u.searchParams.get("v");
            } else if (u.pathname.includes("/embed/")) {
                videoId = u.pathname.split("/embed/")[1];
            }

            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
        }

        // Google Slides
        if (
            u.hostname.includes("docs.google.com") &&
            u.pathname.includes("/presentation/")
        ) {
            // Ensure it's in embed mode if possible, though usually the user provides the publish link
            // If it's a /pub link, it's already embeddable usually.
            // If it's a /edit link, we might want to convert it to /embed?
            // For now, let's trust the user or just return as is if it's already an embed link.
            // A common pattern for slides is /presentation/d/ID/embed
            if (
                !u.pathname.includes("/embed") &&
                !u.pathname.includes("/pub")
            ) {
                return url.replace(
                    /\/edit.*$/,
                    "/embed?start=false&loop=false&delayms=3000",
                );
            }
        }

        return url;
    } catch (e) {
        console.error("Error parsing URL:", url, e);
        return url;
    }
}
