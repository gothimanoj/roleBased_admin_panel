const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");
require('./technologiesModel')
require('./servicesModel')
const {
    PROJECT_STATUS,
    PROJECT_TYPE,
    PROJECT_PAYMENT_MODEL,
} = require("../helpers/constants");

const commentsSchema = new mongoose.Schema({
    commentType: {
        type: String,
        enum: ["Shortlist", "Quotation"],
    },
    comment: {
        type: String,
    },
    reply: {
        type: String,
    },
});

const projectStatusesSchema = new mongoose.Schema({
    status: {
        type: String,
    },
    isAchieved: {
        type: Boolean,
        default: false,
    },
});

const projectProposalsSchema = new mongoose.Schema({
    agencyId: {
        type: mongoose.Types.ObjectId,
        ref: "Agency",
    },
    isShortListed: {
        type: Boolean,
        default: false,
    },
    isAskedForQuotation: {
        type: Boolean,
        default: false,
    },
    isCommentSectionActive: {
        type: Boolean,
        default: true,
    },
    isReplySectionActive: {
        type: Boolean,
        default: false,
    },
    quotationLink: {
        type: String,
    },
    isProposalActionActive: {
        type: Boolean,
        default: false,
    },
    finalCostByClient: {
        type: Number,
    },
    projectStartDateByClient: {
        type: Date,
    },
    projectDelayedStartDateByClient: {
        type: Date,
    },
    projectEndDateByClient: {
        type: Date,
    },
    projectExpectedEndDateByClient: {
        type: Date,
    },
    clientNegotiablePrice: {
        type: Number,
    },
    agencyNegotiablePrice: {
        type: Number,
    },
    isQuotationAcceptedByClient: {
        type: Boolean,
        default: false,
    },
    rejectReasonByClient: {
        type: String,
    },
    isQuotationAcceptedByAgency: {
        type: Boolean,
        default: false,
    },
    rejectReasonByAgency: {
        type: String,
    },
    isSeen: {
        type: Boolean,
        default: false
    },
    notificationFlag: {
        type: Number,
        default: 0
    },
    comments: [commentsSchema],
});

const projectSchema = new mongoose.Schema(
    {
        clientId: {
            type: mongoose.Types.ObjectId,
            ref: "Client",
        },
        projectName: {
            type: String,
        },
        projectDescription: {
            type: String,
        },
        projectRequirements: {
            type: String,
            default: "",
        },
        projectFiles: [
            {
                type: String,
            },
        ],
        projectExpectedStartingDays: {
            type: Number,
            default: 0,
        },
        projectStartDate: {
            type: Date,
        },
        projectEndDate: {
            type: Date,
        },
        projectExpectedTimeline: {
            type: Number,
        },
        projectProposalCost: {
            type: Number,
        },
        projectHourBasisCost: {
            type: Number,
        },
        projectFinalCost: {
            type: Number,
        },
        projectResources: {
            type: Number,
        },
        projectDomainId: {
            type: mongoose.Types.ObjectId,
            ref: "Domain",
        },
        agencyExperience: {
            type: String,
        },
        isProjectManagerRequired: {
            type: Boolean,
        },
        stepsCompleted: {
            type: Number,
            default: 0,
        },
        projectType: {
            type: String,
            enum: PROJECT_TYPE,
        },
        projectPaymentModel: {
            type: String,
            enum: PROJECT_PAYMENT_MODEL,
        },
        projectCurrentStatus: {
            type: String,
            enum: PROJECT_STATUS,
            default: PROJECT_STATUS[0],
        },
        projectStatuses: [projectStatusesSchema],
        projectExpertiseRequired: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Expertise",
            },
        ],
        projectServicesRequired: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Service",
            },
        ],
        projectTechnologiesRequired: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Technology",
            },
        ],
        projectProposals: [projectProposalsSchema],
    },
    {
        timestamps: true,
    }
);

projectSchema.plugin(mongoosePaginate);
projectSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Project", projectSchema);
