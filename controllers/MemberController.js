import mongoose from "mongoose";
import Member from "../models/MembersModel.js";
import User from "../models/UserModel.js";




const addMember = async (req, res) => {

    try {
        const { userId, memberId } = req.body;
        
        if (!userId || !memberId) {
            return res.status(400).json({ message: "User and Member are required" });
        }

        if (userId === memberId) {
            return res.status(400).json({ message: "You cannot invite yourself" });
        }

        const existingMember = await Member.findOne({
            $or: [
                { userId: userId, memberId: memberId },
                { userId: memberId, memberId: userId },
            ],
        }
        );
        if (existingMember) {
            return res.status(400).json({ message: "Alerdy invited" });
        }

        const user = await User.findOne({ _id: userId });
        const membr = await User.findOne({ _id: memberId });

        const member = new Member({
            name: "membership between" +" "+ (user.name) + " and " + (membr.name),
            userId,
            memberId
        })

        await member.save();

        return res.status(201).json({ message: "Member added successfully", member: member });
        
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error" });
    }
    
}
const getMembers = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ message: "User and Member are required" });
        }

        const userMembers = await Member.find({
            $or: [
                { userId: userId},
                { memberId: userId },
            ],
        }).populate("memberId").populate("userId");
        if (!userMembers || userMembers.length === 0) {
            return res.status(404).json({ message: "No members found" });
        }

        return res.status(200).json({ message: "Members found", members: userMembers });
        
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error" });
    }
} 

const deleteMember = async (req, res) => {
    try {
        const { userId, memberId } = req.body;

        if (!userId || !memberId) {
          return res
            .status(400)
            .json({ message: "User and Member are required" });
        }

        const existingMember = await Member.findOne({
          $or: [
            { userId: userId, memberId: memberId },
            { userId: memberId, memberId: userId },
          ],
        });
        if (existingMember) {
          await Member.findByIdAndDelete(existingMember._id);
          return res.status(200).json({ message: "Member deleted successfully" });
        }
        
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error" });
    }
}



export { addMember, deleteMember, getMembers };