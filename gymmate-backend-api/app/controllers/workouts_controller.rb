class WorkoutsController < ApplicationController
  def create
    account = Account.find_by(auth_token: params[:auth_token])
    user = User.find_by(id: account.userable_id)
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
