"use server"

interface EmailData {
  name: string
  email: string
  message: string
}

export async function sendEmail(data: EmailData) {
  // This is a placeholder for actual email sending functionality
  // In a real implementation, you would use a service like Nodemailer, SendGrid, etc.

  // Simulate a delay to mimic API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // For demonstration purposes, we'll just log the data
  console.log("Email data received:", data)

  // In a real implementation, you would send the email here
  // For example, with SendGrid:
  // await sendgrid.send({
  //   to: 'rayane.zangui@efrei.net',
  //   from: data.email,
  //   subject: `Message from ${data.name}`,
  //   text: data.message,
  // });

  // Return success
  return { success: true }
}
