// Fetches all events from the /events page

// External Libs
import axios from 'axios';
import { load } from 'cheerio';
import { idGenerator } from '../util';


const fetchAllEvents = (page: number = 1): Promise<Object> => {
    return new Promise((resolve, reject) => {
        if(page < 1) reject("Page must be greater than 0");
        const Events = new Array();
        axios.get(`https://www.vlr.gg/events/?page=${page}`)
            .then((response) => {
                console.log("OK");
                let $ = load(response.data);
                $('.event-item').each((i, element) => {
                    const eventTitle = $(element).find('.event-item-title').text().trim();
                    const eventDate = $(element).find('.event-item-desc-item.mod-dates').text().trim().split("\t")[0];
                    const eventStatus = $(element).find('.event-item-desc-item-status').text().trim();
                    const eventPrize = $(element).find('.event-item-desc-item.mod-prize').text().trim().split("\t")[0];
                    const eventRegion = $(element).find('.event-item-desc-item.mod-location > i')?.attr("class")?.split(" ")[1].split("-")[1].toUpperCase();
                    let eventLogo = "https:" + $(element).find('.event-item-thumb > img').attr('src');
                    if(!eventLogo.includes("https://")) {
                        // Check if it has 1 slash or none
                        if(eventLogo.includes("https:/")) {
                            // It has 1 slash, add another
                            eventLogo = eventLogo.replace("https:/", "https://");
                        } else {
                            // It has no slashes, add 2
                            eventLogo = eventLogo.replace("https:", "https://");
                        }
                    }
                    const eventLink = $(element).attr('href');
                    const eventId = eventLink.split('/')[2];
                    if (eventStatus == "Completed") return;
                    Events.push({
                        type: "event",
                        name: eventTitle,
                        title: eventTitle,
                        date: eventDate,
                        status: eventStatus,
                        prize: eventPrize,
                        region: eventRegion,
                        logo: eventLogo,
                        link: `https://www.vlr.gg${eventLink}`,
                        id: idGenerator(eventId)
                    });
                });
                resolve(Events);
            }).catch((err) => {
                reject(err);
            });
    });
    // Validate input
    if(page < 1) throw new Error("Page must be greater than 0");
    // Set return object
    const Events = new Array();
    // Fetch all pages
    console.log(page);
    console.log(`https://www.vlr.gg/events/?page=${page}`);
    axios.get(`https://www.vlr.gg/events/?page=${page}`)
    .then((response) => {
        console.log("OK");
    });
    console.log(2);
    // Parse all pages
    // let $ = load(data.data);
    // $('.event-item').each((i, element) => {
    //     const eventTitle = $(element).find('.event-item-title').text().trim();
    //     const eventDate = $(element).find('.event-item-desc-item.mod-dates').text().trim().split("\t")[0];
    //     const eventStatus = $(element).find('.event-item-desc-item-status').text().trim();
    //     const eventPrize = $(element).find('.event-item-desc-item.mod-prize').text().trim().split("\t")[0];
    //     const eventRegion = $(element).find('.event-item-desc-item.mod-location > i')?.attr("class")?.split(" ")[1].split("-")[1].toUpperCase();
    //     let eventLogo = "https:" + $(element).find('.event-item-thumb > img').attr('src');
    //     if(!eventLogo.includes("https://")) {
    //         // Check if it has 1 slash or none
    //         if(eventLogo.includes("https:/")) {
    //             // It has 1 slash, add another
    //             eventLogo = eventLogo.replace("https:/", "https://");
    //         } else {
    //             // It has no slashes, add 2
    //             eventLogo = eventLogo.replace("https:", "https://");
    //         }
    //     }
    //     const eventLink = $(element).attr('href');
    //     const eventId = eventLink.split('/')[2];
    //     if (eventStatus == "Completed") return;
    //     Events.push({
    //         type: "event",
    //         name: eventTitle,
    //         title: eventTitle,
    //         date: eventDate,
    //         status: eventStatus,
    //         prize: eventPrize,
    //         region: eventRegion,
    //         logo: eventLogo,
    //         link: `https://www.vlr.gg${eventLink}`,
    //         id: idGenerator(eventId)
    //     });
    // });
    // console.log(4);
    return Events;
}

export { fetchAllEvents };
