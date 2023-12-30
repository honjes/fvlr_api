type Route = {
    method: string;
    path: string;
    name: string;
    scraper: Promise<object>;
    exact?: boolean;
    routes?: Route[];
}
export default Route;