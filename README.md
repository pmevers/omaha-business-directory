#  Omaha Business Directory Extractor
*This is a work in progress that I built with [Crawlee](https://crawlee.dev/)*

## Current State:
* Extracts every business from the Omaha Chamber of Commerce's website
* Writes the extracted data to a JSON file

## Try it out 
### *Or check out an extract [here:](https://github.com/pmevers/omaha-business-directory/blob/main/json_out/20221202T053645302Z170680.json)*

Prequisite: Node.js 16 or higher and NPM installed

1. Clone the repository
```
git clone https://github.com/pmevers/omaha-business-directory/blob/main/json_out/omaha-businesses.json
```
2. Install
```
npm install
```
3. Run
```
npm run start
```

In [main.ts](https://github.com/pmevers/omaha-business-directory/tree/main/src), I set the start url to Omaha Chamber's Directory at https://your.omahachamber.org/directory/:

![image](https://user-images.githubusercontent.com/85088664/205219240-8e6d037d-500f-4044-a1f5-e4c49bb2e0fa.png)

The HTML on this page contains the urls for each business category. This app will extract each of those urls and log each collected url to the console. Each get request is stored in [omaha-business-directory/storage/request_queues/default/](https://github.com/pmevers/omaha-business-directory/tree/main/storage/request_queues/default).

![image](https://user-images.githubusercontent.com/85088664/205218893-ef7ebad6-d7c8-43b0-addb-1bc6c26ea527.png)

We could also write the url queue to a single file with node's WriteFileSync if you have a need for that. In this case, I don't need to know which URLs were scraped.

These urls are gathered from the categories that the Omaha Chamber here: https://your.omahachamber.org/directory/

![image](https://user-images.githubusercontent.com/85088664/205219240-8e6d037d-500f-4044-a1f5-e4c49bb2e0fa.png)


For each URL we collected, we can extract all relevant data for each business from the cards on the pages that we queued from the start url:

![image](https://user-images.githubusercontent.com/85088664/205219510-4903d3b6-69d9-44bc-bc4a-959d62f4a012.png)

[Here](https://github.com/pmevers/omaha-business-directory/blob/main/json_out/20221202T053645902Z080955.json) is the example output:

![image](https://user-images.githubusercontent.com/85088664/205223497-a114525e-08e8-416a-ac9a-2f391e2c6e8a.png)


## Roadmap:
* Write logic to concatenate each json
* Create modules for other source URLs
* Create a PostgreSQL instance to host the data
* Create a lead-tracking app

