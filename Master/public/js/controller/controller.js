let socket = io('http://localhost:8081')
// Recuperation des serveurs deja connecte
socket.on('slaveInit', (init) => {
  init.slaves.forEach(slave => {
    addSlave(slave, init.state)
  })
})
socket.emit('clientSlaveInit')

/**
 * When a slave connects to the application
 */
socket.on('slaveConnection', (slave) => {
  addSlave(slave)
})

/**
 * Function when a slave disconnect from the application
 */
socket.on('slaveDisconnect', (slave) => {
  $('.' + slave.id).remove()
})

/**
 * Function to display the preview of an algorithm
 */
socket.on('displayPreview', (data) => {
  let output = $('#output-' + data.slaveId)
  let currentMeta = $('#meta-' + data.slaveId)
  let executing = '<span class="ui tiny header orange">Executing</span><i class="notched orange circle loading small icon"></i>'
  let finished = '<span class="ui tiny header green">Finished</span><i class="green check small icon"></i> - <a href=""> Check the statistics</a>'
  let stopped = '<span class="ui tiny header red">Stopped</span><i class="red unlinkify small icon"></i>'
  if (currentMeta.html() !== executing && currentMeta.html() !== finished && currentMeta.html() !== stopped) {
    currentMeta.empty().append(executing)
    output.show()
  }
  output.append('[i=' + data.nthIteration + '] : ' + data.preview + ' <br>')
  output.animate({scrollTop: output.prop('scrollHeight')}, 12)
})

/**
 * Function to display the result of an algorithm
 */
socket.on('displayResult', (data) => {
  let meta = '<span class="ui tiny header green">Finished</span><i class="green check small icon"></i> - <a href=""> Check the statistics</a>'
  if ($('#meta-' + data.slaveId).val() !== meta) {
    $('#meta-' + data.slaveId).empty().append(meta)
  }
})

/**
 * Function to save the algorithm
 */
$('#uploadAlgo').click(() => {
  let algo = JSON.stringify(editor.getValue())
  $.post('/uploadAlgo', {algo: algo}, function (json, textStatus) {})
  toggleSlaves(true)
})

/**
 * Function to render an algorithm
 */
$('body').on('click', '.launch', function (event) {
  let slaveId = $(this).parents().find('form').find('input:hidden').val()
  $('#output-' + slaveId).text('$ >')
  $('#meta-' + slaveId).text('Available')
  let stopButton = $('#stop-' + slaveId)
  console.log(stopButton.val())
  $(this).fadeOut(400, () => {
    let that = $(this)
    stopButton.fadeIn(400).click(() => {
      $('#meta-' + slaveId).empty().append('<span class="ui tiny header red">Stopped</span><i class="red unlinkify small icon"></i>')
      socket.emit('clientStoppedVM', slaveId)
      that.fadeIn(400)
      stopButton.fadeOut(400)
    })
  })
  $.post('/launchAlgo', {
    server: $(this).prop('id'),
    iteration: $(this).parents().find('.iteration').val(),
    slaveId: slaveId
  })
})
