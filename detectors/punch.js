define(['../lib/util'], function( util ) {
	
	var absSum = util.absSum;
	var PUNCH_DIVISOR = 400;
	
	var exports = {};
	exports.create = function( trigger, controller ) {
		var lastPunches = {};
		
		return function( frame ) {
			var prevFrame = controller.frame(1);
			var tenFramesAgo = controller.frame(5);
			
			if (!prevFrame || !tenFramesAgo || !prevFrame.valid || !tenFramesAgo.valid ) { return }
					
			frame.hands.forEach(function( hand ) {
				
				// only punch once every 2.5/10 second
				if (lastPunches[hand.id] > frame.timestamp - 250000) { return }
				// punches are fists, there should be no fingers.
				if (hand.fingers.length) { return }
				
				var prevFrameHand = prevFrame.hand(hand.id);
				var tenFrameHand = tenFramesAgo.hand(hand.id);
				
				if (!prevFrameHand.valid || !tenFrameHand.valid) { return }
							
				var currentVelocity = Math.floor( absSum(hand.palmVelocity) / PUNCH_DIVISOR );
				var prevFrameVelocity = Math.floor( absSum(prevFrameHand.palmVelocity) / PUNCH_DIVISOR );
				var tenFrameVelocity = Math.floor( absSum(tenFrameHand.palmVelocity) / PUNCH_DIVISOR );
				
				if (currentVelocity === 0 && prevFrameVelocity !== 0) {
					lastPunches[hand.id] = frame.timestamp;
					trigger('punch', hand);
				} else {
					//console.log( currentVelocity, prevFrameVelocity, tenFrameVelocity)
				}
				
			});
		}
	}
	
	return exports;
});