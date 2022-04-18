export const getSender = (loggedUser,users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
}

//two user inside of this arrayif not agroup chat  this logic will be helpful



export const getSenderFull = (loggedUser,users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
}

//all of our mesg, current msg , index,logged inuser id
export const isSameSender = (messages, m, i, userId) => {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id ||
            messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId   // if its opp usr only its display pic
    );
};

//messagesarray,currentindex 
export const isLastMessage = (messages, i, userId) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    );
};

//if the same sender whos logged in return 33margin ;
export const isSameSenderMargin = (messages, m, i, userId) => {

    if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== userId
    )
        return 33;
        //otherwise return 0 margin..
        else if (
        (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) ||
        (i == messages.length - 1 && messages[i].sender._id !== userId)
      )
        return 0;
            else return "auto";
};
           //mesg,currebt msg,index

export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
}; // if the index is morethan 0 and sender id of prev  msg is equal  to current msg id 