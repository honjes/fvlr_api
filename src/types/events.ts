import { scraped_item } from "./scraped_item";
type event_small = scraped_item & {
    title: string;
    date: string;
    status: string;
    prize: string;
    region: string;
    logo: string;
};
type event_medium = scraped_item & {
    img?: string;
    teams_item: Array<Object>;
    players_item: Array<Object>;
    failed_links: Array<Object>;
}
export { event_small, event_medium };