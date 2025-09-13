import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import About from '@/views/About.vue'

describe('About.vue', () => {
  it('renders inner text', () => {
    const wrapper = shallowMount(About, {
      global: {
        mocks: {
          $t: (key) => {
            const translations = {
              'about.title': 'About Us',
              'about.subtitle':
                'Discover the story behind our music platform and the technology that powers your musical journey.',
              'about.our_story': 'Our Story',
              'about.mission_title': 'Our Mission',
              'about.mission_description':
                'To create a seamless music experience that connects artists and listeners through innovative technology, fostering a global community of music lovers.',
              'about.vision_title': 'Our Vision',
              'about.vision_description':
                'To be the leading platform where music creators and enthusiasts come together to share, discover, and celebrate the universal language of music.',
              'about.features_title': 'What We Offer',
              'about.feature1_title': 'Music Streaming',
              'about.feature1_description':
                'High-quality audio streaming with personalized playlists and recommendations.',
              'about.feature2_title': 'Community',
              'about.feature2_description':
                'Connect with fellow music lovers, share your favorite tracks, and discover new artists.',
              'about.feature3_title': 'Easy Upload',
              'about.feature3_description':
                'Simple drag-and-drop interface for uploading and managing your music collection.',
              'about.tech_title': 'Built With Modern Technology',
            }
            return translations[key] || key
          },
        },
      },
    })
    expect(wrapper.text()).toContain('About Us')
  })
})
