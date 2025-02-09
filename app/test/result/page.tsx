"use client";
import { Button, Card, CardContent, Typography, Divider } from "@mui/material";

export default function TestResult() {
  return (
    <div className="h-full flex items-center justify-center p-6">
      <Card className="max-w-md w-full rounded-xl shadow-lg">
        {/* Header */}
        <div className="bg-purple-600 p-4 text-white text-center rounded-t-xl">
          <Typography variant="h5" className="font-bold uppercase">
            TEST RESULT
          </Typography>
        </div>

        <CardContent className="space-y-4 text-center">
          {/* Score Details */}
          <div className="space-y-3 px-6">
            <div className="flex justify-between bg-gray-100 p-2 rounded-lg">
              <Typography>योग्य उत्तरे :</Typography>
              <Typography className="text-green-600 font-semibold">
                १०
              </Typography>
            </div>
            <div className="flex justify-between bg-gray-100 p-2 rounded-lg">
              <Typography>चुकीची उत्तरे :</Typography>
              <Typography className="text-red-600 font-semibold">५</Typography>
            </div>
            <div className="flex justify-between bg-gray-100 p-2 rounded-lg">
              <Typography>खेळातील वेळ :</Typography>
              <Typography className="text-orange-500 font-semibold">
                २० मिनिटे
              </Typography>
            </div>
            <div className="flex justify-between bg-gray-100 p-2 rounded-lg">
              <Typography>एकूण गुण :</Typography>
              <Typography className="text-blue-600 font-semibold">
                १०
              </Typography>
            </div>
          </div>

          {/* Message */}
          <Typography variant="h6" className="text-red-500 font-bold">
            शुभेच्छा!
          </Typography>
          <Divider />
          <Typography className="text-purple-600 font-semibold">
            चाचणी पूर्ण केल्याबद्दल तुम्हाला एक तारा मिळाला आहे !
          </Typography>

          {/* Star Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-white flex items-center justify-center rounded-full shadow-lg text-3xl">
              ⭐
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center space-y-4 mt-4 mx-4">
            <Button
              variant="contained"
              className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg w-full"
            >
              उत्तर तपासा
            </Button>
            <Button
              variant="contained"
              className="bg-green-500 text-white font-semibold px-6 py-2 rounded-lg w-full"
            >
              समाप्त करा
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
