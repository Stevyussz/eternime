import { fetchAPI } from "@/lib/api";
import { StreamResponse } from "@/types";
import { Metadata } from "next";
import { WatchContent } from "@/components/features/WatchContent";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    try {
        const res = await fetchAPI<StreamResponse>(`/episode/${slug}`);
        return {
            title: `Watch ${res.data.details.title} - Eternime`,
        };
    } catch (e) {
        return { title: "Watch Anime - Eternime" };
    }
}

export default async function WatchPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    let streamData;
    try {
        streamData = await fetchAPI<StreamResponse>(`/episode/${slug}`);
    } catch (error) {
        return <div className="text-center p-20 text-red-500">Error loading video</div>;
    }

    return (
        <div className="container mx-auto px-0 pb-20 pt-10">
            <WatchContent streamData={streamData} slug={slug} />
        </div>
    );
}