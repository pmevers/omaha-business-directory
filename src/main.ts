import { PlaywrightCrawler, log, createPlaywrightRouter } from 'crawlee';
import * as fs from 'fs';

// This directory contains the cards to scrape URLs from
const startUrls = ['https://your.omahachamber.org/directory/'];

const crawler = new PlaywrightCrawler({
    requestHandler: async ({ request, page, enqueueLinks }) => {

        createPlaywrightRouter()
        log.info(`Collected: ${request.loadedUrl}`);
        
        // This queues each card, representing a category of businesses in Omaha
        await enqueueLinks({
           selector: 'h5.card-title > a',
           globs:['https://your.omahachamber.org/directory/Search/**'],
        });

        //Only scrape URLs with /Search/ in URL path.
        if (request.loadedUrl?.includes('/Search/')) {
            
            // Visit each URL that is queued from enqueueLinks and grab all child elements from the cards. This will extract data for businesses in each category.
            const businesses = await page.$$eval('.card', allItems => {
                const businessData = new Array
                    allItems.forEach(item => {
                        let name
                        let omahachamberUrl = new String
                        if (item.querySelector('h5 >  a')?.getAttribute('href')) {
                            omahachamberUrl = item.querySelector('h5 > a')?.getAttribute('href')
                            name = item.querySelector('h5 > a')?.textContent
                        } else {
                            omahachamberUrl = ""
                            name = ""
                        }
    
                        let gmapsUrl = new String
                        if (item.querySelector('div.card-body > ul.list-group > li.gz-card-address > a:nth-child(1)')?.getAttribute('href')) {
                            gmapsUrl = item.querySelector('div.card-body > ul.list-group > li.gz-card-address > a:nth-child(1)')?.getAttribute('href')
                        } else {
                            gmapsUrl = ""
                        }
    
                        let phone = new String
                        if (item.querySelector('.gz-card-phone > a')) {
                            phone = item.querySelector('.gz-card-phone > a')?.getAttribute('href')?.substring(4)
                        } else {
                            phone = ""
                        }
    
                        let website = new String
                        if (item.querySelector('div.card-body > ul.list-group > li.gz-card-website > a:nth-child(1)')) {
                            website = item.querySelector('div.card-body > ul.list-group > li.gz-card-website > a:nth-child(1)')?.getAttribute('href')
                        } else {
                            website = ""
                        }
                        let description = new String
                        if (item.querySelector('div.card-body > ul.list-group > li.gz-card-description > div')) {
                            description = item.querySelector('div.card-body > ul.list-group > li.gz-card-description > div')?.textContent
                        } else {
                            description = ""
                        }
    
                        let categories = new Array
                        if (item.querySelectorAll('div.gz-directory-card > div:nth-child(3) > div:nth-child(2)')) {
                            categories = []
                            item.querySelectorAll('div.gz-directory-card > div:nth-child(3) > div:nth-child(2) > span')?.forEach(child => {
                                categories.push(child.textContent)
                            })
                        } else {
                            categories = []
                        }
    
                        let address = new String
                        if (item.querySelector('div.card-body > ul.list-group > li.gz-card-address')) {
                            address = item.querySelector('div.card-body > ul.list-group > li.gz-card-address > a:nth-child(1) > span:nth-child(2)')?.innerHTML
                                + ', ' + item.querySelector('div.card-body > ul.list-group > li.gz-card-address > a:nth-child(1) > span:nth-child(4)')?.innerHTML
                                + ', ' + item.querySelector('div.card-body > ul.list-group > li.gz-card-address > a:nth-child(1) > span:nth-child(6)')?.innerHTML
                                + item.querySelector('div.card-body > ul.list-group > li.gz-card-address > a:nth-child(1) > span:nth-child(7)')?.innerHTML
                        } else {
                            address = ""
                        }
                        businessData.push({ name, gmapsUrl, omahachamberUrl, phone, address, website, description, categories })

                    })
                    return businessData;
                }
            )
            // Write the output to JSON
            await fs.writeFileSync('./json_out/omaha-businesses.json',JSON.stringify({...businesses}))
        }
        
    }
})

await crawler.run(startUrls)

