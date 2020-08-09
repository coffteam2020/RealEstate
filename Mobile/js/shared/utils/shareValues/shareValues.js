let participants = [];

class ShareValues {

	static pushParticipants(participant) {
		const index = indexOfParticipants(participants, participant);
		if (index != -1) {
			participants.splice(index, 1);
		}
		participants.push(participant);
	}

	static getParticipants() {
		return participants;
	}

	static resetParticipants() {
		participants = [];
	}
}

export {ShareValues};

function indexOfParticipants(participants, participant) {
	const participantArr = Object.values(participant);
	let index = participants.length;
	while (index--) {
		let equalIndex = 0;
		let participantSavedArr = Object.values(participants[index]);
		for (let i = 0; i < participantArr.length; i++) {
			if (participantArr[i].user_id === participantSavedArr[i].user_id) {
				equalIndex++;
			}
		}
		if (equalIndex === participantArr.length) {
			return index;
		}
	}
	return -1;
}
