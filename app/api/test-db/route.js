import { NextResponse } from "next/server";
import { dbTests } from "@/utils/dbTest";

export async function GET() {
  try {
    const results = await dbTests.runAllTests();

    // Check if all tests passed
    const allPassed =
      results.connection.success &&
      results.tables.every((t) => t.exists) &&
      results.validation.every((v) => v.success) &&
      results.constraints.email.success &&
      results.constraints.foreignKeys.every((fk) => fk.success) &&
      results.relationships.every((r) => r.valid);

    return NextResponse.json({
      success: allPassed,
      results,
      message: allPassed
        ? "All database tests passed successfully"
        : "Some tests failed, check detailed results",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: "Failed to complete database tests",
      },
      { status: 500 }
    );
  }
}
