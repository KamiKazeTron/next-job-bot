import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      age: true,
      sex: true,
      address: true,
      phone: true,
      education: true,
      experience: true,
    },
  });

  return (
    <div className="max-w-md mx-auto bg-white shadow p-6 rounded mt-10">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="space-y-3">
        <p>
          <span className="font-semibold">Name:</span> {user.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-semibold">Age:</span> {user.age}
        </p>
        <p>
          <span className="font-semibold">Sex:</span> {user.sex}
        </p>
        <p>
          <span className="font-semibold">Address:</span> {user.address}
        </p>
        <p>
          <span className="font-semibold">Phone:</span> {user.phone}
        </p>
        <p>
          <span className="font-semibold">Education:</span> {user.education}
        </p>
        <p>
          <span className="font-semibold">Experience:</span> {user.experience}
        </p>
      </div>
    </div>
  );
}
