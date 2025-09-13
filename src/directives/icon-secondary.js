export default {
  beforeMount(el, binding) {
    let iconClass = `fas fa-${binding.value.icon} text-green-400 text-2xl`
    if (binding.value.right) {
      iconClass += ' float-right'
    }

    const i = document.createElement('i')
    i.className = iconClass
    el.appendChild(i)
  },
}
