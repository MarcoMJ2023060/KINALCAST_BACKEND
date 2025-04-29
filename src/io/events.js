import Channel from "../channel/channel.model.js";
import Message from '../messages/message.model.js'

export const emitChatHistory = async (socket, channelId) => {
  try {
    const channel = await Channel.findById(channelId).populate('messages')

    if(channel){
        return socket.emit('chat-history', {
            channelId,
            messages: channel.messages.map((m) => ({
                author: m.author,
                content: m.content,
                date: m.date
            }))
        })
    }

    console.log(channelId)
    socket.emit('chat-history', {
        errorOcurred: true
    })

  } catch (e) {
    console.log(e);
    socket.emit("chat-history", {
      errorOcurred: true,
    });
  }
};

export const emitChatMessage = async (io, messageData) => {
  try{
    const channel = await Channel.findById(messageData.toChannel);

    if(channel){
      const newMessage = new Message({
        content: messageData.message.content,
        author: messageData.message.author,
        date: new Date(),
      })

      await newMessage.save();

      channel.messages.push(newMessage._id)

      await channel.save();

      io.to(messageData.toChannel).emit('chat-message', newMessage)
    }
    
  }catch(e){
    console.log(e)
  }
}
