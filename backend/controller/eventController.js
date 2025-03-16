const Event = require("../model/eventModel");

const addEvent = async (req, res) => {
  try {
    const event = await Event.create({
      eventTitle: req.body.eventTitle,
      eventDescription: req.body.eventDescription,
      applyLink: req.body.applyLink,
    });

    const eventDetail = {
      eventTitle: event.eventTitle,
      eventDescription: event.eventDescription,
      applyLink: event.applyLink,
    };

    res.status(200).json({
      status: "Success",
      message: "event added successfully.",
      event: eventDetail,
    });
  } catch (error) {
    res.status(400).json({
      status: "failure",
      message: "event cannot be added.",
    });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({
      status: "Success",
      message: "fetched the events successfully.",
      events: events
    });
  } catch (error) {
    res.status(200).json({
      status: "failure",
      message: `cannot fetch the events ${error}`,
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "Success",
      message: "Event deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: `event cannot be deleted ${error}`,
    });
  }
};

const editEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = {
      eventTitle: req.body.eventTitle,
      eventDescription: req.body.eventDescription,
      applyLink: req.body.applyLink,
    };
    const result = await Event.findByIdAndUpdate(id, updatedEvent, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({
        status: "failure",
        message: "event not found.",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "event details editted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "event details cannot be editted.",
    });
  }
};

module.exports = { addEvent, getAllEvents, deleteEvent, editEvent };
