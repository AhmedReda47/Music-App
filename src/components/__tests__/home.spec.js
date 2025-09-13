import { shallowMount } from '@vue/test-utils'
import Home from '@/views/Home.vue'
import SongItem from './songItem.vue'

describe('Home.vue', () => {
  test('render list of songs', () => {
    const songs = [{}, {}, {}]
    const component = shallowMount(Home, {
      data() {
        return {
          songs,
        }
      },
      global: {
        mocks: {
          $t: (key) => key, // Mock i18n function
        },
        directives: {
          'icon-secondary': () => {}, // Mock directive
        },
      },
    })
    const items = component.findAllComponents(SongItem)

    expect(items).toHaveLength(songs.length)

    items.forEach((wrapper, i) => {
      expect(wrapper.props().song).toStrictEqual(songs[i])
    })
  })
})
