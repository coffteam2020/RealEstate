//Birhtday only
function autoSplitTextBirthday(text) {
	let constant = '__/__/____';
	constant[0] = text[0];
	for (let i = 0; i < constant.length; i++) {
		if (i < 2) {
			constant[i] = text[i];
		} else {
			if (i > 2 && i < 5) {
				constant[i + 1] = text[i];
			} else if (i > 5) {
				constant[i + 2] = text[i];
			}
		}
	}
	return constant;
}

function isPropDifferent(obj1, obj2) {
	return JSON.stringify(obj1) !== JSON.stringify(obj2);
}

function indexOfMessages(arr, obj, msgId) {
	let index = arr.length;
	let id = msgId || obj.doc_id;
	while (index--) {
		if (arr[index].doc_id === id) {
			return index;
		}
	}
	return -1;
}

function generateDoccumentId(userId1, userId2) {
	let docId = '';
	userId1 = userId1 + '';
	userId2 = userId2 + '';
	if (Number(userId1) < Number(userId2)) {
		docId = userId1 + '_' + userId2;
	} else {
		docId = userId2 + '_' + userId1;
	}
	return docId;
}
function compare(a, b) {
	if ((a?.id ? a?.id : a?._id) < (b?.id ? b?.id : b?._id)) {
		return -1;
	}
	if (a?.id ? a?.id : a?._id > (b?.id ? b?.id : b?._id)) {
		return 1;
	}
	return 0;
}
function generateDoccumentIds(users) {
	let docId = '';
	let a = users?.sort(compare);
	console.log(JSON.stringify(a));
	for (let i = 0; i < a?.length; i++) {
		if (a?.[i]?.id || a?.[i]?._id) {
			docId = docId + '_' + (a?.[i]?.id ? a?.[i]?.id : a?.[i]?._id);
		}
	}
	return docId;
}

export const StringHelper = {
	autoSplitTextBirthday,
	isPropDifferent,
	indexOfMessages,
	generateDoccumentId,
	generateDoccumentIds,
};