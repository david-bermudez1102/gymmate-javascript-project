class ExerciseSerializer < ActiveModel::Serializer
  attributes :id, :title, :sets, :program_id
end
