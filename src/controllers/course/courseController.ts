import courseModel, { CourseItem } from "../../repositories/courseModel";

class CourseController {
  courseGet(): Promise<CourseItem[]> {
    return courseModel.getAll();
  }
}

export default new CourseController();
