import { getCollection } from "astro:content";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "fs/promises";
import path from "path";

export async function getStaticPaths() {
    if (import.meta.env.DEV) {
        return [];
    }

    const researchEntries = await getCollection("research");
    const paths: any[] = researchEntries.map((entry) => ({
        params: { slug: `research/${entry.slug}` },
        props: {
            title: entry.data.title,
            subtitle: entry.data.summary,
            type: "Research",
            authors: entry.data.authors,
            group: entry.data.group,
            links: {
                video: !!entry.data.video,
                slides: !!entry.data.slideshow,
            },
            // Ensure other props are present to satisfy type if needed, or just let 'any' handle it
            leads: [],
            meetings: [],
        },
    }));

    const groupEntries = await getCollection("groups");
    const groupPaths = groupEntries.map((entry) => ({
        params: { slug: `groups/${entry.slug}` },
        props: {
            title: entry.data.name,
            subtitle: entry.data.summary,
            type: "Group",
            leads: entry.data.leads,
            meetings: entry.data.meetings,
            authors: [],
            group: undefined,
            links: { video: false, slides: false },
        },
    }));

    paths.push(...groupPaths);

    // Static pages
    paths.push({
        params: { slug: "index" },
        props: {
            title: "Security Through Community",
            subtitle: "RITSEC",
            type: "Home",
            // Fill defaults
            leads: [],
            meetings: [],
            authors: [],
            group: undefined,
            links: { video: false, slides: false },
        },
    });

    paths.push({
        params: { slug: "alumni" },
        props: {
            title: "Alumni",
            subtitle: "RITSEC's Alumnis",
            type: "Alumni",
            leads: [],
            meetings: [],
            authors: [],
            group: undefined,
            links: { video: false, slides: false },
        },
    });

    paths.push({
        params: { slug: "events" },
        props: {
            title: "Events",
            subtitle: "Competitions, CTFs, and more",
            type: "Events",
            leads: [],
            meetings: [],
            authors: [],
            group: undefined,
            links: { video: false, slides: false },
        },
    });

    paths.push({
        params: { slug: "about" },
        props: {
            title: "About Us",
            subtitle: "History, E-Board, and Mission",
            type: "About",
            leads: [],
            meetings: [],
            authors: [],
            group: undefined,
            links: { video: false, slides: false },
        },
    });

    paths.push({
        params: { slug: "join" },
        props: {
            title: "Join RITSEC",
            subtitle: "Become a member today",
            type: "Join",
            leads: [],
            meetings: [],
            authors: [],
            group: undefined,
            links: { video: false, slides: false },
        },
    });

    paths.push({
        params: { slug: "sponsors" },
        props: {
            title: "Sponsors",
            subtitle: "Our partners and supporters",
            type: "Sponsors",
            leads: [],
            meetings: [],
            authors: [],
            group: undefined,
            links: { video: false, slides: false },
        },
    });

    return paths;
}

export async function GET({ params, props }) {
    const { title, subtitle, type, authors, group, links, leads, meetings } =
        props;

    // Load Fonts
    const fontSans = await fs.readFile(
        path.resolve(
            "./node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff",
        ),
    );

    const fontMono = await fs.readFile(
        path.resolve(
            "./node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff",
        ),
    );

    // Load Logo
    const logoBuffer = await fs.readFile(
        path.resolve("./src/assets/logoLarge.png"),
    );
    const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

    // RITSEC Theme Colors
    const accentColor = "#e69132";
    const bgColor = "#0d1117";
    const textColor = "#ffffff";
    const dimColor = "#8b949e";
    const borderColor = "#30363d";

    const markup = {
        type: "div",
        props: {
            style: {
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                backgroundColor: bgColor,
                color: textColor,
                padding: "60px",
                justifyContent: "space-between",
                fontFamily: "IBM Plex Sans",
                // Subtle dot pattern + Gradient overlay
            },
            children: [
                // Top Bar: Type + Icons
                {
                    type: "div",
                    props: {
                        style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            marginBottom: "20px",
                        },
                        children: [
                            {
                                type: "div",
                                props: {
                                    style: {
                                        fontSize: "24px",
                                        fontFamily: "IBM Plex Mono",
                                        color: accentColor,
                                        textTransform: "uppercase",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                    },
                                    children: [
                                        type === "Research" && group
                                            ? `${type} • ${group.id.toUpperCase()}`
                                            : type || "RITSEC",
                                    ],
                                },
                            },
                            // Research Icons
                            links &&
                                (links.video || links.slides) && {
                                    type: "div",
                                    props: {
                                        style: {
                                            display: "flex",
                                            gap: "15px",
                                        },
                                        children: [
                                            links.video && {
                                                type: "div",
                                                props: {
                                                    style: {
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "6px",
                                                        fontSize: "20px",
                                                        color: dimColor,
                                                        fontFamily:
                                                            "IBM Plex Mono",
                                                    },
                                                    children: "VIDEO",
                                                },
                                            },
                                            links.slides && {
                                                type: "div",
                                                props: {
                                                    style: {
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "6px",
                                                        fontSize: "20px",
                                                        color: dimColor,
                                                        fontFamily:
                                                            "IBM Plex Mono",
                                                    },
                                                    children: "SLIDES",
                                                },
                                            },
                                        ],
                                    },
                                },
                        ],
                    },
                },

                // Main Content
                {
                    type: "div",
                    props: {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: "15px",
                        },
                        children: [
                            {
                                type: "div",
                                props: {
                                    style: {
                                        fontSize: "64px",
                                        fontWeight: 700,
                                        lineHeight: 1.1,
                                        textWrap: "balance",
                                    },
                                    children: title,
                                },
                            },
                            subtitle && {
                                type: "div",
                                props: {
                                    style: {
                                        fontSize: "32px",
                                        color: dimColor,
                                        lineHeight: 1.4,
                                        marginTop: "10px",
                                    },
                                    children:
                                        subtitle.length > 120
                                            ? subtitle.slice(0, 120) + "..."
                                            : subtitle,
                                },
                            },
                        ],
                    },
                },

                // Footer Info (Authors, Meetings, Leads)
                {
                    type: "div",
                    props: {
                        style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                            marginTop: "40px",
                            borderTop: `2px solid ${accentColor}`,
                            paddingTop: "20px",
                        },
                        children: [
                            // Left Side: Details
                            {
                                type: "div",
                                props: {
                                    style: {
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "10px",
                                    },
                                    children: [
                                        // Research Authors
                                        authors &&
                                            authors.length > 0 && {
                                                type: "div",
                                                props: {
                                                    style: {
                                                        display: "flex",
                                                        flexDirection: "column",
                                                    },
                                                    children: [
                                                        {
                                                            type: "div",
                                                            props: {
                                                                style: {
                                                                    fontSize:
                                                                        "16px",
                                                                    color: dimColor,
                                                                    fontFamily:
                                                                        "IBM Plex Mono",
                                                                    textTransform:
                                                                        "uppercase",
                                                                },
                                                                children:
                                                                    "AUTHORS",
                                                            },
                                                        },
                                                        {
                                                            type: "div",
                                                            props: {
                                                                style: {
                                                                    fontSize:
                                                                        "24px",
                                                                    fontWeight:
                                                                        "bold",
                                                                },
                                                                children:
                                                                    authors
                                                                        .map(
                                                                            (
                                                                                a,
                                                                            ) =>
                                                                                a.name,
                                                                        )
                                                                        .join(
                                                                            ", ",
                                                                        ),
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        // Group Meetings
                                        meetings &&
                                            meetings.length > 0 && {
                                                type: "div",
                                                props: {
                                                    style: {
                                                        display: "flex",
                                                        flexDirection: "column",
                                                    },
                                                    children: [
                                                        {
                                                            type: "div",
                                                            props: {
                                                                style: {
                                                                    fontSize:
                                                                        "16px",
                                                                    color: dimColor,
                                                                    fontFamily:
                                                                        "IBM Plex Mono",
                                                                    textTransform:
                                                                        "uppercase",
                                                                },
                                                                children:
                                                                    "MEETING TIME",
                                                            },
                                                        },
                                                        {
                                                            type: "div",
                                                            props: {
                                                                style: {
                                                                    fontSize:
                                                                        "24px",
                                                                    fontWeight:
                                                                        "bold",
                                                                },
                                                                children: `${meetings[0].day}s @ ${meetings[0].start} in ${meetings[0].location}`,
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        // Group Leads
                                        leads &&
                                            leads.length > 0 && {
                                                type: "div",
                                                props: {
                                                    style: {
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        marginTop: meetings
                                                            ? "10px"
                                                            : "0",
                                                    },
                                                    children: [
                                                        {
                                                            type: "div",
                                                            props: {
                                                                style: {
                                                                    fontSize:
                                                                        "16px",
                                                                    color: dimColor,
                                                                    fontFamily:
                                                                        "IBM Plex Mono",
                                                                    textTransform:
                                                                        "uppercase",
                                                                },
                                                                children:
                                                                    "LEADS",
                                                            },
                                                        },
                                                        {
                                                            type: "div",
                                                            props: {
                                                                style: {
                                                                    fontSize:
                                                                        "24px",
                                                                    fontWeight:
                                                                        "bold",
                                                                },
                                                                children: leads
                                                                    .map(
                                                                        (l) =>
                                                                            l.name,
                                                                    )
                                                                    .join(", "),
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                    ],
                                },
                            },
                            // Right Side: RITSEC Logo
                            {
                                type: "img",
                                props: {
                                    src: logoBase64,
                                    width: 150,
                                    style: {
                                        objectFit: "contain",
                                    },
                                },
                            },
                        ],
                    },
                },
            ],
        },
    };

    const svg = await satori(markup, {
        width: 1200,
        height: 630,
        fonts: [
            {
                name: "IBM Plex Sans",
                data: fontSans,
                weight: 700,
                style: "normal",
            },
            {
                name: "IBM Plex Mono",
                data: fontMono,
                weight: 400,
                style: "normal",
            },
        ],
    });

    const resvg = new Resvg(svg);
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    return new Response(pngBuffer, {
        headers: {
            "Content-Type": "image/png",
        },
    });
}
