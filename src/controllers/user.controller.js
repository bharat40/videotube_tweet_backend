import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // get user from frontend
    // validation - not empty
    // check if user already exists (username, email)
    // check for images, avatar specially
    // upload them to cloudinary
    // create user object - create entry in database
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const { username, email, fullname, password } = req.body;

    if (!username || !email || !password || !fullname) {
        throw new ApiError(400, "All fields are required");
    }
    const userExists = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (userExists) {
        throw new ApiError(409, "User already exists with this email or username")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }



    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const newUser = await User.create({
        username: username.toLowerCase(),
        fullname,
        password,
        email,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    })

    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

export { registerUser };