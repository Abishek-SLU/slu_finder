
import { apiRequest } from "./api";
import { getToken } from "./authSession";

export type StudentProfile = {
    userId: string;
    userName: string;
    fullName: string;
    email: string;
    bio: string | null;
    program: string | null;
    academicYear: string | null;
    major: string | null;
    profileImageUrl: string | null;
};

export type StudentProfileRequest = {
    bio: string;
    program: string;
    academicYear: string;
    major: string;
    profileImageUrl: string | null;
};

export type Interest = {
    id: string;
    name: string;
    category: string;
};

async function requireToken(): Promise<string> {
    const token = await getToken();

    if (!token) {
        throw new Error("Please log in again.");
    }

    return token;
}

export async function getStudentProfile(): Promise<StudentProfile> {
    const token = await requireToken();

    return apiRequest<StudentProfile>(
        "/api/student/profile",
        "GET",
        undefined,
        token
    );
}

export async function updateStudentProfile(
    profile: StudentProfileRequest
): Promise<StudentProfile> {
    const token = await requireToken();

    return apiRequest<StudentProfile>(
        "/api/student/profile",
        "PUT",
        profile,
        token
    );
}

export async function getAvailableInterests(): Promise<Interest[]> {
    const token = await requireToken();

    return apiRequest<Interest[]>(
        "/api/student/interests",
        "GET",
        undefined,
        token
    );
}

export async function getMyInterests(): Promise<Interest[]> {
    const token = await requireToken();

    return apiRequest<Interest[]>(
        "/api/student/my-interests",
        "GET",
        undefined,
        token
    );
}

export async function saveMyInterests(
    interestIds: string[]
): Promise<Interest[]> {
    const token = await requireToken();

    return apiRequest<Interest[]>(
        "/api/student/my-interests",
        "PUT",
        { interestIds },
        token
    );
}
export type DiscoveredStudent = {
    userId: string;
    userName: string;
    fullName: string;
    program: string | null;
    major: string | null;
    academicYear: string | null;
    bio: string | null;
    profileImageUrl: string | null;
    sharedInterestCount: number;
    sharedInterests: string[];
};

export async function discoverStudents(): Promise<DiscoveredStudent[]> {
    const token = await requireToken();

    return apiRequest<DiscoveredStudent[]>(
        "/api/student/discover",
        "GET",
        undefined,
        token
    );
}