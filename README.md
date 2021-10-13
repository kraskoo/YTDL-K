# YTDL-K
YouTube Downloader  
Download video or whole playlist, can convert to mp3

### Requirements
	NodeJS

### Installation
	npm i

### Usage:
	node index [options...]
  
### Options:  
	Required:
	        -u, --url <YouTube Url> - link to YouTube page
	Optional:
	        -f, --format <Output format> - formats: (mp4, mp3) or (0, 1) - default: mp4
	                if you select mp3, it will be provided additional operation for converting mp4 to mp3
	                Important: this operation slow down the whole process
	        -l, --list <List Option> - options: (false, true) or (0, 1) - default: false
	                if you select true, it will download automatically all URLs in given YouTube playlist
	                Important: You need to provide YouTube URL including playlist in the query string
	        -tn, --track-number <Prefix> - prefixes: add number or anything else to the title of track - default: empty
	                Important: Will not work for playlists
	        -o, --output <Path> - path: working directory for the app - default: './output'
			-s, --skip <Number> - Skip N tracks from playlist
### Examples:
	node index -u "https://www.youtube.com/watch?v=dp7D-nAS2WY&list=PLX_17zp0nBu8yW3dhLyRVG_dQDHUUc-ws",
	node index --url "https://www.youtube.com/watch?v=dp7D-nAS2WY" --track-number "01",
	node index -u "https://www.youtube.com/watch?v=dp7D-nAS2WY&list=PLX_17zp0nBu8yW3dhLyRVG_dQDHUUc-ws" -l "true",
	node index --url "https://www.youtube.com/playlist?list=PLX_17zp0nBu8yW3dhLyRVG_dQDHUUc-ws" -l "true" -o "D:\"