#!/usr/bin/env node
'use strict'

const dgram = require('dgram')

const nextDepartureInDirection = require('./next-departure-in-direction')

const setColor = (color) =>
	new Promise((yay, nay) => {
		const client = dgram.createSocket('udp4')
		client.send(Buffer.from(color), 1738, 'localhost', (err) => {
			client.close()
			if (err) nay(err)
			else yay()
		})
	})

const colors = [
	'red', // < 2m
	'yellow', // < 4m
	'green', // < 6m
	'yellow', // < 8m
	'red' // < 10m
]

module.exports = (from, to) =>
	nextDepartureInDirection(from, to)
	.then((ms) => {
		const i = Math.floor(ms/1000/60/2)
		return setColor(colors[i] || 'question')
	})
