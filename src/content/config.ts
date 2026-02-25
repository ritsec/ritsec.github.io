import { z, reference, defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";

const groups = defineCollection({
    type: "content",
    schema: ({ image }) =>
        z.object({
            name: z.string(),
            summary: z.string(),
            active: z.boolean().default(true),
            meetings: z
                .array(
                    z.object({
                        day: z.enum([
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                        ]),
                        start: z.string(),
                        end: z.string(),
                        location: z.string(),
                    }),
                )
                .optional(),
            leads: z
                .array(
                    z.object({
                        name: z.string(),
                    }),
                )
                .default([]),
            logo: image(),
            website: z.string().optional(),
        }),
});

const schedule = defineCollection({
    loader: glob({
        pattern: "**/*.{yml,yaml}",
        base: "./src/content/schedule",
        generateId: ({ entry }) => entry.replace(/\.yml$/, ""),
    }),
    schema: z.array(
        z.object({
            title: z.string(),
            start: z.date(),
            end: z.date(),
            location: z.string().default("GOL 1400"),
            group: reference("groups").default("general"),
            hosts: z
                .array(z.object({ name: z.string() }))
                .default([{ name: "RITSEC E-Board" }]),
            slide: z.string().url().optional(),
            video: z.string().url().optional(),
            website: z.string().url().optional(),
        }),
    ),
});

const events = defineCollection({
    type: "content",
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            start: z.date().optional(),
            end: z.date().optional(),
            location: z.string(),
            access: z.string(),
            summary: z.string(),
            website: z.string().optional(),
            image: image(),
        }),
});

const research = defineCollection({
    type: "content",
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            authors: z
                .array(
                    z.object({
                        name: z.string(),
                        handle: z.string().optional(),
                        avatar: image().optional(),
                        url: z.string().url().optional(),
                    }),
                )
                .default([]),
            date: z.date(),
            image: image().optional(),
            imageAlt: z.string().optional(),
            group: reference("groups").optional(),
            summary: z.string(),
            video: z.string().url().optional(),
            slideshow: z.string().url().optional(),
        }),
});

const sponsors = defineCollection({
    loader: file("src/content/sponsors.yml"),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            image: image(),
            url: z.string().url(),
            tier: z.enum([
                "diamond",
                "platinum",
                "gold",
                "silver",
                "educational",
            ]),
            type: z.enum(["company", "individual"]).optional(),
        }),
});

const eboard = defineCollection({
    loader: file("src/content/eboard.yml"),
    schema: ({ image }) =>
        z.object({
            id: z.string(),
            name: z.string(),
            grad_year: z.number(),
            linked_in: z.string(),
            image: image(),
            email: z.string(),
        }),
});

const legacyEboard = defineCollection({
    loader: file("src/content/legacy-eboard.yml"),
    schema: z.object({
        term: z.string(),
        organization: z.string(),
        eboard: z.array(
            z.object({
                position: z.string(),
                name: z.string(),
            }),
        ),
    }),
});

const alumni = defineCollection({
    loader: file("src/content/alumni.yml"),
    schema: z.object({
        names: z.array(z.string()),
    }),
});

export const collections = {
    groups,
    schedule,
    events,
    research,
    sponsors,
    eboard,
    legacyEboard,
    alumni,
};
