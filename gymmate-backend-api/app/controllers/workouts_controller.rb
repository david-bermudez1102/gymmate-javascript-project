class WorkoutsController < ApplicationController
  def create
    user = User.find_by(id: current_user.userable_id)
    workout = user.workouts.build(workout_params)
    if workout.save
      render json: workout
    end
  end

   private
    def workout_params
      params.require(:workout).permit(:program_id)
    end
end
