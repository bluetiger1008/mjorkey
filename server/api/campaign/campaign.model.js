'use strict';

import mongoose, {Schema} from 'mongoose';

var CampaignSchema = new mongoose.Schema({
    artistID: String,
    artistName: String,
    city: String,
    state: String,
    startedByUser: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    description: String,
    goals: Number,
    current_goal: {
        type: Number,
        default: 0
    },
    vip_max: Number,
    vip_price: Number,
    vip_sold: {
        type: Number,
        default: 0
    },
    general_price: Number,
    progress: {
        type: Number,
        default: 0
    },
    puchased_users: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    venue: String,
    ends_date: Date,
    timeRemaining: [Number, Number]
});

export default mongoose.model('Campaign', CampaignSchema);
