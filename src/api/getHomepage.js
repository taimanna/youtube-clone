import getChannelPhoto from './getChannelPhoto'
import getSearch from './getSearch'
import he from 'he'
import moment from 'moment'
import youtubeService from './apiConfig'

export const getHomepage = async () => {
  try {
    const response = await youtubeService.search.list({
      part: 'snippet',
      maxResults: 50,
      q: '',
      type: 'video',
      regionCode: 'VN',
      order: 'date',
      relevanceLanguage: 'vi',
    })

    const channelId = []

    const homepageData = []

    console.log(response.data.items)

    response.data.items.map((item) => {
      const data = {
        videoId: item.id.videoId,
        channelId: item.snippet.channelId,
        thumbnail: `https://i.ytimg.com/vi/${item.id.videoId}/mqdefault.jpg`,
        // srcSet: `https://i.ytimg.com/vi/${item.id.videoId}/hqdefault.jpg`,
        title: he.decode(item.snippet.title),
        channelPhoto: '',
        channelName: item.snippet.channelTitle,
        view: '123',
        relativeTime: moment(item.snippet.publishTime).fromNow(),
      }

      channelId.push(item.snippet.channelId)
      homepageData.push(data)
    })

    const uniqueChannelId = [...new Set(channelId)]
    const channelPhotos = await getChannelPhoto(channelId)

    homepageData.map((item) => {
      item.channelPhoto = channelPhotos[item.channelId]
    })

    // return homepageData
  } catch (error) {
    console.log(error)
  }
}