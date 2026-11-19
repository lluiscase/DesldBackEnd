import connection from "../database/database";

export interface CourseItem {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  lessonsCount: number;
  durationMinutes: number;
  image: string;
  isFree: boolean;
  price: number;
  originalPrice?: number;
  rating: number;
  studentsCount: number;
  badge?: string;
}

class CourseModel {
  getAll(): Promise<CourseItem[]> {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM courses ORDER BY created_at ASC", (err: any, rows: any[]) => {
        if (err) return reject(err);

        const courses: CourseItem[] = (rows || []).map((row) => ({
          id: row.id,
          title: row.title,
          description: row.description,
          category: row.category,
          level: row.level,
          lessonsCount: Number(row.lessons_count),
          durationMinutes: Number(row.duration_minutes),
          image: row.image_url,
          isFree: Boolean(row.is_free),
          price: Number(row.price),
          originalPrice: row.original_price ? Number(row.original_price) : undefined,
          rating: Number(row.rating),
          studentsCount: Number(row.students_count),
          badge: row.badge || undefined
        }));

        resolve(courses);
      });
    });
  }
}

export default new CourseModel();
